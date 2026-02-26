import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExt = /\.(jpg|jpeg|png|gif|webp)$/i;
    const allowedMime = /^image\/(jpeg|png|gif|webp)$/;
    if (allowedExt.test(path.extname(file.originalname)) && allowedMime.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens (jpg, png, gif, webp) sao permitidas"));
    }
  },
});

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

const ADMIN_USERNAME = "hcorbage";
const ADMIN_PASSWORD_ENV = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD_ENV) {
  console.warn("WARNING: ADMIN_PASSWORD not set. Admin login will not work until it is configured.");
}

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Nao autorizado" });
  }
  next();
}

function deleteFileIfExists(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error("Error deleting file:", e);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgStore = connectPgSimple(session);

  app.use(
    session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "corb3d-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  let adminPasswordHash: string | null = null;
  async function getAdminHash() {
    if (!adminPasswordHash) {
      adminPasswordHash = await hashPassword(ADMIN_PASSWORD_ENV);
    }
    return adminPasswordHash;
  }

  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados invalidos", errors: parsed.error.flatten() });
      }
      const message = await storage.createContactMessage(parsed.data);
      return res.status(201).json({ message: "Mensagem enviada com sucesso!", id: message.id });
    } catch (error) {
      console.error("Error saving contact message:", error);
      return res.status(500).json({ message: "Erro ao salvar mensagem" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    if (!ADMIN_PASSWORD_ENV) {
      return res.status(503).json({ message: "Admin nao configurado" });
    }
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password) {
      const hash = await getAdminHash();
      const valid = await comparePasswords(password, hash);
      if (valid) {
        req.session.isAdmin = true;
        return res.json({ ok: true });
      }
    }
    return res.status(401).json({ message: "Usuario ou senha incorretos" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (req.session.isAdmin) {
      return res.json({ authenticated: true });
    }
    return res.status(401).json({ authenticated: false });
  });

  app.get("/api/admin/messages", requireAdmin, (req, res) => {
    storage.getContactMessages().then((messages) => res.json(messages));
  });

  app.patch("/api/admin/messages/:id/read", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    storage.markMessageRead(id).then(() => res.json({ ok: true }));
  });

  app.patch("/api/admin/messages/:id/unread", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    storage.markMessageUnread(id).then(() => res.json({ ok: true }));
  });

  app.delete("/api/admin/messages/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    storage.deleteMessage(id).then(() => res.json({ ok: true }));
  });

  app.use("/uploads", (await import("express")).default.static(uploadsDir));

  app.get("/api/portfolio", async (_req, res) => {
    try {
      const items = await storage.getPortfolioItemsWithImages();
      return res.json(items);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return res.status(500).json({ message: "Erro ao buscar portfolio" });
    }
  });

  app.get("/api/admin/portfolio", requireAdmin, async (req, res) => {
    try {
      const items = await storage.getPortfolioItemsWithImages();
      return res.json(items);
    } catch (error) {
      console.error("Error fetching admin portfolio:", error);
      return res.status(500).json({ message: "Erro ao buscar portfolio" });
    }
  });

  app.post("/api/admin/portfolio", requireAdmin, upload.array("images", 6), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Pelo menos uma imagem obrigatoria" });
      }
      const title = req.body.title || "Sem titulo";
      const description = req.body.description || null;
      const category = req.body.category || "Geral";
      const coverUrl = `/uploads/${files[0].filename}`;

      const item = await storage.createPortfolioItem({
        title,
        description,
        category,
        imageUrl: coverUrl,
      });

      for (let i = 0; i < files.length; i++) {
        await storage.addPortfolioImage({
          portfolioItemId: item.id,
          imageUrl: `/uploads/${files[i].filename}`,
          displayOrder: i,
        });
      }

      const fullItem = await storage.getPortfolioItemsWithImages();
      const created = fullItem.find(x => x.id === item.id);
      return res.status(201).json(created || item);
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      return res.status(500).json({ message: "Erro ao salvar item" });
    }
  });

  app.post("/api/admin/portfolio/:id/images", requireAdmin, upload.single("image"), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    try {
      if (!req.file) return res.status(400).json({ message: "Imagem obrigatoria" });
      const existingImages = await storage.getPortfolioImages(id);
      if (existingImages.length >= 6) {
        deleteFileIfExists(path.join(uploadsDir, req.file.filename));
        return res.status(400).json({ message: "Maximo de 6 fotos por album" });
      }
      const image = await storage.addPortfolioImage({
        portfolioItemId: id,
        imageUrl: `/uploads/${req.file.filename}`,
        displayOrder: existingImages.length,
      });
      return res.status(201).json(image);
    } catch (error) {
      console.error("Error adding portfolio image:", error);
      return res.status(500).json({ message: "Erro ao adicionar imagem" });
    }
  });

  app.delete("/api/admin/portfolio/images/:imageId", requireAdmin, async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    if (isNaN(imageId)) return res.status(400).json({ message: "ID invalido" });
    try {
      const allItems = await storage.getPortfolioItemsWithImages();
      for (const item of allItems) {
        const found = item.images.find(img => img.id === imageId);
        if (found) {
          deleteFileIfExists(path.join(uploadsDir, path.basename(found.imageUrl)));
          break;
        }
      }
      await storage.deletePortfolioImage(imageId);
      return res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting portfolio image:", error);
      return res.status(500).json({ message: "Erro ao excluir imagem" });
    }
  });

  const updatePortfolioSchema = z.object({
    title: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
  });

  app.patch("/api/admin/portfolio/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    try {
      const parsed = updatePortfolioSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados invalidos", errors: parsed.error.flatten() });
      }
      const updated = await storage.updatePortfolioItem(id, parsed.data);
      if (!updated) return res.status(404).json({ message: "Item nao encontrado" });
      return res.json(updated);
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      return res.status(500).json({ message: "Erro ao atualizar item" });
    }
  });

  app.delete("/api/admin/portfolio/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    try {
      const images = await storage.getPortfolioImages(id);
      const item = await storage.getPortfolioItemById(id);
      for (const img of images) {
        deleteFileIfExists(path.join(uploadsDir, path.basename(img.imageUrl)));
      }
      if (item) {
        deleteFileIfExists(path.join(uploadsDir, path.basename(item.imageUrl)));
      }
      await storage.deletePortfolioItem(id);
      return res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      return res.status(500).json({ message: "Erro ao excluir item" });
    }
  });

  app.get("/api/settings/whatsapp", async (_req, res) => {
    try {
      const number = await storage.getSetting("whatsapp_number");
      return res.json({ whatsappNumber: number || "" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar configuracao" });
    }
  });

  app.get("/api/settings/business-hours", async (_req, res) => {
    try {
      const hours = await storage.getSetting("business_hours");
      return res.json({ business_hours: hours || "" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar horario" });
    }
  });

  app.get("/api/settings/about", async (_req, res) => {
    try {
      const aboutKeys = ["about_title", "about_content", "about_image_1", "about_image_2", "about_image_3"];
      const result: Record<string, string> = {};
      for (const key of aboutKeys) {
        const val = await storage.getSetting(key);
        if (val) result[key] = val;
      }
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar dados sobre" });
    }
  });

  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      const obj: Record<string, string> = {};
      for (const s of settings) obj[s.key] = s.value;
      return res.json(obj);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar configuracoes" });
    }
  });

  const aboutUpload = upload.fields([
    { name: "about_image_1", maxCount: 1 },
    { name: "about_image_2", maxCount: 1 },
    { name: "about_image_3", maxCount: 1 },
  ]);

  app.put("/api/admin/settings", requireAdmin, aboutUpload, async (req, res) => {
    try {
      const { whatsapp_number, about_title, about_content, business_hours } = req.body;
      if (typeof whatsapp_number === "string") {
        await storage.setSetting("whatsapp_number", whatsapp_number);
      }
      if (typeof business_hours === "string") {
        await storage.setSetting("business_hours", business_hours);
      }
      if (typeof about_title === "string") {
        await storage.setSetting("about_title", about_title);
      }
      if (typeof about_content === "string") {
        await storage.setSetting("about_content", about_content);
      }
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      if (files) {
        for (const key of ["about_image_1", "about_image_2", "about_image_3"] as const) {
          if (files[key] && files[key].length > 0) {
            await storage.setSetting(key, `/uploads/${files[key][0].filename}`);
          }
        }
      }
      if (req.body.remove_about_image_1 === "true") await storage.setSetting("about_image_1", "");
      if (req.body.remove_about_image_2 === "true") await storage.setSetting("about_image_2", "");
      if (req.body.remove_about_image_3 === "true") await storage.setSetting("about_image_3", "");
      return res.json({ ok: true });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao salvar configuracoes" });
    }
  });

  return httpServer;
}
