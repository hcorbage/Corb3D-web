import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

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

  app.get("/api/admin/messages", (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Nao autorizado" });
    }
    storage.getContactMessages().then((messages) => res.json(messages));
  });

  app.patch("/api/admin/messages/:id/read", (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Nao autorizado" });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    storage.markMessageRead(id).then(() => res.json({ ok: true }));
  });

  app.delete("/api/admin/messages/:id", (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: "Nao autorizado" });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalido" });
    storage.deleteMessage(id).then(() => res.json({ ok: true }));
  });

  return httpServer;
}
