import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Mail, Trash2, Eye, LogOut, ArrowLeft, Clock, Phone, Briefcase, Image, Upload, Plus, X, Edit2, Check, Settings } from "lucide-react";
import type { ContactMessage, PortfolioItemWithImages } from "@shared/schema";

const CYAN_CLASS = "text-[hsl(192,85%,50%)]";
const CYAN_BG = "bg-[hsl(192,85%,48%)]";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/login", { username, password });
    },
    onSuccess: () => onLogin(),
    onError: () => setError("Usuario ou senha incorretos"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4">
      <Card className="bg-white/[0.03] border-white/[0.06] p-8 w-full max-w-sm" data-testid="card-login">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[hsl(192,85%,48%)]/10 flex items-center justify-center mx-auto mb-4">
            <Lock className={`w-8 h-8 ${CYAN_CLASS}`} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
          <p className="text-sm text-white/60">Area restrita Corb3D</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/70 mb-1.5 block">Usuario</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
              placeholder="admin" data-testid="input-admin-username" />
          </div>
          <div>
            <label className="text-xs text-white/70 mb-1.5 block">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
              placeholder="••••••••" data-testid="input-admin-password" />
          </div>
          {error && <p className="text-sm text-red-400" data-testid="text-login-error">{error}</p>}
          <Button type="submit" size="lg" className="w-full font-bold" disabled={loginMutation.isPending} data-testid="button-admin-login">
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-white/50 hover:text-white/70 transition-colors inline-flex items-center gap-1" data-testid="link-back-home">
            <ArrowLeft className="w-3 h-3" /> Voltar ao site
          </a>
        </div>
      </Card>
    </div>
  );
}

function MessageCard({ msg, onMarkRead, onMarkUnread, onDelete }: { msg: ContactMessage; onMarkRead: () => void; onMarkUnread: () => void; onDelete: () => void }) {
  const date = new Date(msg.createdAt);
  const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <Card className={`border-white/[0.06] p-5 transition-all ${msg.read ? "bg-white/[0.02]" : "bg-white/[0.05] border-l-2 border-l-[hsl(192,85%,48%)]"}`} data-testid={`card-message-${msg.id}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`text-base font-semibold ${msg.read ? "text-white/80" : "text-white"}`} data-testid={`text-msg-name-${msg.id}`}>{msg.name}</h3>
            {!msg.read && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(192,85%,48%)]/20 text-[hsl(192,85%,48%)] font-medium" data-testid={`badge-new-${msg.id}`}>Nova</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Clock className="w-3 h-3" />
            <span data-testid={`text-msg-date-${msg.id}`}>{formatted}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={msg.read ? onMarkUnread : onMarkRead}
            className={`p-2 rounded-md bg-white/[0.05] hover:bg-white/[0.1] transition-colors ${msg.read ? "text-white/40 hover:text-[hsl(192,85%,48%)]" : "text-[hsl(192,85%,48%)] hover:text-white"}`}
            title={msg.read ? "Marcar como nao lida" : "Marcar como lida"} data-testid={`button-mark-read-${msg.id}`}>
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-md bg-white/[0.05] hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors" title="Excluir" data-testid={`button-delete-${msg.id}`}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-white/70"><Mail className="w-3.5 h-3.5 shrink-0" /><span data-testid={`text-msg-email-${msg.id}`}>{msg.email}</span></div>
        {msg.phone && <div className="flex items-center gap-2 text-white/70"><Phone className="w-3.5 h-3.5 shrink-0" /><span data-testid={`text-msg-phone-${msg.id}`}>{msg.phone}</span></div>}
        {msg.service && <div className="flex items-center gap-2 text-white/70"><Briefcase className="w-3.5 h-3.5 shrink-0" /><span data-testid={`text-msg-service-${msg.id}`}>{msg.service}</span></div>}
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <p className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed" data-testid={`text-msg-body-${msg.id}`}>{msg.message}</p>
      </div>
    </Card>
  );
}

function MessagesTab() {
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({ queryKey: ["/api/admin/messages"] });
  const markReadMutation = useMutation({ mutationFn: async (id: number) => { await apiRequest("PATCH", `/api/admin/messages/${id}/read`); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }); } });
  const markUnreadMutation = useMutation({ mutationFn: async (id: number) => { await apiRequest("PATCH", `/api/admin/messages/${id}/unread`); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }); } });
  const deleteMutation = useMutation({ mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/messages/${id}`); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] }); } });

  const unreadCount = messages?.filter((m) => !m.read).length || 0;
  const totalCount = messages?.length || 0;

  return (
    <>
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Card className="bg-white/[0.03] border-white/[0.06] px-5 py-3 flex items-center gap-3" data-testid="card-stat-total">
          <Mail className="w-5 h-5 text-white/60" />
          <div><p className="text-2xl font-bold text-white">{totalCount}</p><p className="text-xs text-white/60">Total</p></div>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.06] px-5 py-3 flex items-center gap-3" data-testid="card-stat-unread">
          <div className="w-2 h-2 rounded-full bg-[hsl(192,85%,48%)]" />
          <div><p className={`text-2xl font-bold ${CYAN_CLASS}`}>{unreadCount}</p><p className="text-xs text-white/60">Nao lidas</p></div>
        </Card>
      </div>
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => (<Card key={i} className="bg-white/[0.03] border-white/[0.06] p-5 animate-pulse"><div className="h-4 bg-white/10 rounded w-1/3 mb-3" /><div className="h-3 bg-white/5 rounded w-1/2 mb-2" /><div className="h-3 bg-white/5 rounded w-full" /></Card>))}</div>
      ) : messages && messages.length > 0 ? (
        <div className="space-y-4">{messages.map((msg) => (<MessageCard key={msg.id} msg={msg} onMarkRead={() => markReadMutation.mutate(msg.id)} onMarkUnread={() => markUnreadMutation.mutate(msg.id)} onDelete={() => deleteMutation.mutate(msg.id)} />))}</div>
      ) : (
        <Card className="bg-white/[0.03] border-white/[0.06] p-12 text-center" data-testid="card-no-messages">
          <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/80 mb-2">Nenhuma mensagem</h3>
          <p className="text-sm text-white/60">As mensagens enviadas pelo formulario de contato aparecerao aqui.</p>
        </Card>
      )}
    </>
  );
}

function PortfolioUploadForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Geral");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (files.length === 0) throw new Error("Selecione pelo menos uma imagem");
      const formData = new FormData();
      files.forEach(f => formData.append("images", f));
      formData.append("title", title || "Sem titulo");
      formData.append("description", description);
      formData.append("category", category);
      const res = await fetch("/api/admin/portfolio", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Erro ao enviar"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remaining = 6 - files.length;
    const toAdd = selected.slice(0, remaining);
    const newFiles = [...files, ...toAdd];
    setFiles(newFiles);
    toAdd.forEach(f => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <Card className="bg-white/[0.03] border-white/[0.06] p-6 mb-6" data-testid="card-upload-form">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-white">Novo album do portfolio</h3>
        <button onClick={onClose} className="p-1 text-white/40 hover:text-white/70 transition-colors" data-testid="button-close-upload"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((p, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-md overflow-hidden group">
                <img src={p} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-remove-preview-${idx}`}>
                  <X className="w-3 h-3" />
                </button>
                {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-[hsl(192,85%,48%)] text-white font-medium">Capa</span>}
              </div>
            ))}
          </div>
        )}
        {files.length < 6 && (
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center cursor-pointer hover:border-[hsl(192,85%,48%)]/30 transition-colors"
            data-testid="dropzone-image">
            <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/60 mb-1">Clique para selecionar imagens</p>
            <p className="text-xs text-white/30">Ate {6 - files.length} imagens (JPG, PNG, GIF, WebP - max 10MB cada)</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleFileChange} className="hidden" data-testid="input-file-upload" />
          </div>
        )}
        <div>
          <label className="text-xs text-white/70 mb-1.5 block">Titulo</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
            placeholder="Nome do projeto" data-testid="input-portfolio-title" />
        </div>
        <div>
          <label className="text-xs text-white/70 mb-1.5 block">Descricao (opcional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors resize-none"
            placeholder="Breve descricao do projeto..." data-testid="input-portfolio-description" />
        </div>
        <div>
          <label className="text-xs text-white/70 mb-1.5 block">Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
            data-testid="select-portfolio-category">
            <option value="Geral" className="bg-[#0a0e17]">Geral</option>
            <option value="Prototipagem" className="bg-[#0a0e17]">Prototipagem</option>
            <option value="Producao em Serie" className="bg-[#0a0e17]">Producao em Serie</option>
            <option value="Modelagem 3D" className="bg-[#0a0e17]">Modelagem 3D</option>
            <option value="Pecas Funcionais" className="bg-[#0a0e17]">Pecas Funcionais</option>
            <option value="Decorativo" className="bg-[#0a0e17]">Decorativo</option>
          </select>
        </div>
        {uploadMutation.isError && <p className="text-sm text-red-400" data-testid="text-upload-error">{(uploadMutation.error as Error).message || "Erro ao enviar"}</p>}
        <Button onClick={() => uploadMutation.mutate()} disabled={files.length === 0 || uploadMutation.isPending} className="w-full font-semibold" data-testid="button-submit-portfolio">
          {uploadMutation.isPending ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Enviando...</>) : (<><Upload className="w-4 h-4 mr-2" />Enviar album ({files.length} foto{files.length !== 1 ? "s" : ""})</>)}
        </Button>
      </div>
    </Card>
  );
}

function PortfolioItemCard({ item, onDelete }: { item: PortfolioItemWithImages; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const addImageRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation({
    mutationFn: async () => { await apiRequest("PATCH", `/api/admin/portfolio/${item.id}`, { title, category }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] }); queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] }); setEditing(false); },
  });

  const addImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`/api/admin/portfolio/${item.id}/images`, { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] }); queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] }); },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: number) => { await apiRequest("DELETE", `/api/admin/portfolio/images/${imageId}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] }); queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] }); },
  });

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addImageMutation.mutate(file);
    if (addImageRef.current) addImageRef.current.value = "";
  };

  const date = new Date(item.createdAt);
  const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <Card className="bg-white/[0.03] border-white/[0.06] overflow-hidden" data-testid={`card-portfolio-${item.id}`}>
      <div className="aspect-[4/3] bg-white/[0.02] relative overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" data-testid={`img-portfolio-${item.id}`} />
        {item.images.length > 1 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium flex items-center gap-1">
            <Image className="w-3 h-3" />{item.images.length}
          </div>
        )}
      </div>
      <div className="p-4">
        {editing ? (
          <div className="space-y-2">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[hsl(192,85%,48%)]/40"
              data-testid={`input-edit-title-${item.id}`} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded px-3 py-1.5 text-sm text-white focus:outline-none"
              data-testid={`select-edit-category-${item.id}`}>
              <option value="Geral" className="bg-[#0a0e17]">Geral</option>
              <option value="Prototipagem" className="bg-[#0a0e17]">Prototipagem</option>
              <option value="Producao em Serie" className="bg-[#0a0e17]">Producao em Serie</option>
              <option value="Modelagem 3D" className="bg-[#0a0e17]">Modelagem 3D</option>
              <option value="Pecas Funcionais" className="bg-[#0a0e17]">Pecas Funcionais</option>
              <option value="Decorativo" className="bg-[#0a0e17]">Decorativo</option>
            </select>
            {item.images.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {item.images.map((img, idx) => (
                  <div key={img.id} className="relative aspect-square rounded overflow-hidden group">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    {item.images.length > 1 && (
                      <button onClick={() => deleteImageMutation.mutate(img.id)}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-image-${img.id}`}><X className="w-3 h-3" /></button>
                    )}
                    {idx === 0 && <span className="absolute bottom-0.5 left-0.5 text-[8px] px-1 py-0.5 rounded bg-[hsl(192,85%,48%)] text-white font-medium">Capa</span>}
                  </div>
                ))}
                {item.images.length < 6 && (
                  <div onClick={() => addImageRef.current?.click()}
                    className="aspect-square rounded border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-[hsl(192,85%,48%)]/30 transition-colors"
                    data-testid={`button-add-image-${item.id}`}>
                    <Plus className="w-4 h-4 text-white/30" />
                    <input ref={addImageRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleAddImage} className="hidden" />
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
                className={`flex-1 p-1.5 rounded text-sm font-medium ${CYAN_BG} text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1`}
                data-testid={`button-save-edit-${item.id}`}><Check className="w-3.5 h-3.5" /> Salvar</button>
              <button onClick={() => { setEditing(false); setTitle(item.title); setCategory(item.category); }}
                className="flex-1 p-1.5 rounded text-sm text-white/60 bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                data-testid={`button-cancel-edit-${item.id}`}>Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-[hsl(192,85%,50%)]/60 mb-1">{item.category}</p>
            <h3 className="text-sm font-semibold text-white/90 mb-1" data-testid={`text-portfolio-title-${item.id}`}>{item.title}</h3>
            {item.description && <p className="text-xs text-white/50 mb-2 line-clamp-2">{item.description}</p>}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <span className="text-xs text-white/40">{formatted} · {item.images.length} foto{item.images.length !== 1 ? "s" : ""}</span>
              <div className="flex gap-2">
                <button onClick={() => setEditing(true)} className="p-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white/80 transition-colors" title="Editar" data-testid={`button-edit-portfolio-${item.id}`}>
                  <Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={onDelete} className="p-1.5 rounded bg-white/[0.05] hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors" title="Excluir" data-testid={`button-delete-portfolio-${item.id}`}>
                  <Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function PortfolioTab() {
  const [showUpload, setShowUpload] = useState(false);
  const { data: items, isLoading } = useQuery<PortfolioItemWithImages[]>({ queryKey: ["/api/admin/portfolio"] });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/portfolio/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] }); queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] }); },
  });

  const totalItems = items?.length || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <Card className="bg-white/[0.03] border-white/[0.06] px-5 py-3 flex items-center gap-3" data-testid="card-stat-portfolio">
          <Image className="w-5 h-5 text-white/60" />
          <div><p className="text-2xl font-bold text-white">{totalItems}</p><p className="text-xs text-white/60">Albums</p></div>
        </Card>
        {!showUpload && (
          <Button onClick={() => setShowUpload(true)} className="font-semibold" data-testid="button-add-portfolio">
            <Plus className="w-4 h-4 mr-2" />Novo album
          </Button>
        )}
      </div>
      {showUpload && <PortfolioUploadForm onClose={() => setShowUpload(false)} />}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => (<Card key={i} className="bg-white/[0.03] border-white/[0.06] animate-pulse"><div className="aspect-[4/3] bg-white/[0.05]" /><div className="p-4 space-y-2"><div className="h-3 bg-white/10 rounded w-1/3" /><div className="h-4 bg-white/5 rounded w-2/3" /></div></Card>))}</div>
      ) : items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map((item) => (<PortfolioItemCard key={item.id} item={item} onDelete={() => deleteMutation.mutate(item.id)} />))}</div>
      ) : (
        <Card className="bg-white/[0.03] border-white/[0.06] p-12 text-center" data-testid="card-no-portfolio">
          <Image className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/80 mb-2">Nenhum album no portfolio</h3>
          <p className="text-sm text-white/60 mb-4">Adicione albums com fotos dos seus projetos para exibir na pagina de portfolio.</p>
          {!showUpload && <Button onClick={() => setShowUpload(true)} className="font-semibold" data-testid="button-add-first-portfolio"><Plus className="w-4 h-4 mr-2" />Criar primeiro album</Button>}
        </Card>
      )}
    </>
  );
}

function SettingsTab() {
  const { data: settings, isLoading } = useQuery<Record<string, string>>({ queryKey: ["/api/admin/settings"] });
  const [whatsapp, setWhatsapp] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) {
    setWhatsapp(settings.whatsapp_number || "");
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => { await apiRequest("PUT", "/api/admin/settings", { whatsapp_number: whatsapp }); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/whatsapp"] });
    },
  });

  if (isLoading) {
    return <Card className="bg-white/[0.03] border-white/[0.06] p-6 animate-pulse"><div className="h-4 bg-white/10 rounded w-1/3 mb-4" /><div className="h-10 bg-white/5 rounded w-full" /></Card>;
  }

  return (
    <Card className="bg-white/[0.03] border-white/[0.06] p-6 max-w-lg" data-testid="card-settings">
      <h3 className="text-base font-semibold text-white mb-6">Configuracoes do site</h3>
      <div className="space-y-6">
        <div>
          <label className="text-xs text-white/70 mb-1.5 block">Numero do WhatsApp</label>
          <p className="text-[11px] text-white/40 mb-2">Formato internacional com DDI. Ex: 5511999999999</p>
          <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
            placeholder="5511999999999" data-testid="input-whatsapp-number" />
          <p className="text-[11px] text-white/30 mt-1.5">Deixe vazio para desativar o botao flutuante de WhatsApp no site.</p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="font-semibold" data-testid="button-save-settings">
          {saveMutation.isPending ? "Salvando..." : "Salvar configuracoes"}
        </Button>
        {saveMutation.isSuccess && <p className="text-sm text-green-400" data-testid="text-settings-saved">Configuracoes salvas com sucesso!</p>}
      </div>
    </Card>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"messages" | "portfolio" | "settings">("messages");

  const logoutMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", "/api/admin/logout"); },
    onSuccess: () => onLogout(),
  });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header className="border-b border-white/[0.06] bg-[#060a12]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" data-testid="link-admin-home">
              <img src="/images/corb3d-robot-cropped.png" alt="Corb3D" className="h-8 w-8 object-contain" />
            </a>
            <div>
              <h1 className="text-lg font-bold text-white" data-testid="text-admin-title">CORB<span className={CYAN_CLASS}>3D</span> Admin</h1>
              <p className="text-xs text-white/60">Painel de gerenciamento</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} className="text-white/70 border-white/15 hover:bg-white/10" data-testid="button-admin-logout">
            <LogOut className="w-4 h-4 mr-2" />Sair
          </Button>
        </div>
      </header>

      <div className="border-b border-white/[0.06] bg-[#060a12]/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1">
            {([["messages", "Mensagens", Mail], ["portfolio", "Portfolio", Image], ["settings", "Configuracoes", Settings]] as const).map(([key, label, Icon]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? "border-[hsl(192,85%,48%)] text-white" : "border-transparent text-white/50 hover:text-white/70"}`}
                data-testid={`tab-${key}`}>
                <Icon className="w-4 h-4 inline-block mr-2 -mt-0.5" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "messages" && <MessagesTab />}
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const { data, isLoading } = useQuery<{ authenticated: boolean } | null>({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        if (res.status === 401) return null;
        return await res.json();
      } catch { return null; }
    },
  });

  const isAuth = authenticated === true || (authenticated === null && data?.authenticated);

  if (isLoading && authenticated === null) {
    return (<div className="min-h-screen bg-[#0a0e17] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[hsl(192,85%,48%)]/30 border-t-[hsl(192,85%,48%)] rounded-full animate-spin" /></div>);
  }
  if (!isAuth) return <LoginForm onLogin={() => setAuthenticated(true)} />;
  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
