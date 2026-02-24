import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Mail, Trash2, Eye, LogOut, ArrowLeft, Clock, User, Phone, Briefcase } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

const CYAN_CLASS = "text-[hsl(192,85%,50%)]";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/login", { username, password });
    },
    onSuccess: () => {
      onLogin();
    },
    onError: () => {
      setError("Usuario ou senha incorretos");
    },
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
          <p className="text-sm text-white/40">Area restrita Corb3D</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
              placeholder="admin"
              data-testid="input-admin-username"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
              placeholder="••••••••"
              data-testid="input-admin-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" data-testid="text-login-error">{error}</p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full font-bold"
            disabled={loginMutation.isPending}
            data-testid="button-admin-login"
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-white/30 hover:text-white/50 transition-colors inline-flex items-center gap-1" data-testid="link-back-home">
            <ArrowLeft className="w-3 h-3" /> Voltar ao site
          </a>
        </div>
      </Card>
    </div>
  );
}

function MessageCard({ msg, onMarkRead, onDelete }: { msg: ContactMessage; onMarkRead: () => void; onDelete: () => void }) {
  const date = new Date(msg.createdAt);
  const formatted = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={`border-white/[0.06] p-5 transition-all ${msg.read ? "bg-white/[0.02]" : "bg-white/[0.05] border-l-2 border-l-[hsl(192,85%,48%)]"}`}
      data-testid={`card-message-${msg.id}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`text-base font-semibold ${msg.read ? "text-white/60" : "text-white"}`} data-testid={`text-msg-name-${msg.id}`}>
              {msg.name}
            </h3>
            {!msg.read && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(192,85%,48%)]/20 text-[hsl(192,85%,48%)] font-medium" data-testid={`badge-new-${msg.id}`}>
                Nova
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <Clock className="w-3 h-3" />
            <span data-testid={`text-msg-date-${msg.id}`}>{formatted}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {!msg.read && (
            <button
              onClick={onMarkRead}
              className="p-2 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-colors"
              title="Marcar como lida"
              data-testid={`button-mark-read-${msg.id}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 rounded-md bg-white/[0.05] hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
            title="Excluir"
            data-testid={`button-delete-${msg.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-white/50">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span data-testid={`text-msg-email-${msg.id}`}>{msg.email}</span>
        </div>
        {msg.phone && (
          <div className="flex items-center gap-2 text-white/50">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span data-testid={`text-msg-phone-${msg.id}`}>{msg.phone}</span>
          </div>
        )}
        {msg.service && (
          <div className="flex items-center gap-2 text-white/50">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span data-testid={`text-msg-service-${msg.id}`}>{msg.service}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed" data-testid={`text-msg-body-${msg.id}`}>
          {msg.message}
        </p>
      </div>
    </Card>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/admin/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      onLogout();
    },
  });

  const unreadCount = messages?.filter((m) => !m.read).length || 0;
  const totalCount = messages?.length || 0;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header className="border-b border-white/[0.06] bg-[#060a12]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" data-testid="link-admin-home">
              <img
                src="/images/corb3d-robot-cropped.png"
                alt="Corb3D"
                className="h-8 w-8 object-contain"
              />
            </a>
            <div>
              <h1 className="text-lg font-bold text-white" data-testid="text-admin-title">
                CORB<span className={CYAN_CLASS}>3D</span> Admin
              </h1>
              <p className="text-xs text-white/40">Mensagens de contato</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            className="text-white/50 border-white/10 hover:bg-white/5"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Card className="bg-white/[0.03] border-white/[0.06] px-5 py-3 flex items-center gap-3" data-testid="card-stat-total">
            <Mail className="w-5 h-5 text-white/40" />
            <div>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
              <p className="text-xs text-white/40">Total</p>
            </div>
          </Card>
          <Card className="bg-white/[0.03] border-white/[0.06] px-5 py-3 flex items-center gap-3" data-testid="card-stat-unread">
            <div className="w-2 h-2 rounded-full bg-[hsl(192,85%,48%)]" />
            <div>
              <p className={`text-2xl font-bold ${CYAN_CLASS}`}>{unreadCount}</p>
              <p className="text-xs text-white/40">Nao lidas</p>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/[0.03] border-white/[0.06] p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/2 mb-2" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </Card>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                onMarkRead={() => markReadMutation.mutate(msg.id)}
                onDelete={() => deleteMutation.mutate(msg.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/[0.03] border-white/[0.06] p-12 text-center" data-testid="card-no-messages">
            <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/60 mb-2">Nenhuma mensagem</h3>
            <p className="text-sm text-white/40">As mensagens enviadas pelo formulario de contato aparecerao aqui.</p>
          </Card>
        )}
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
      } catch {
        return null;
      }
    },
  });

  const isAuth = authenticated === true || (authenticated === null && data?.authenticated);

  if (isLoading && authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[hsl(192,85%,48%)]/30 border-t-[hsl(192,85%,48%)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuth) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
