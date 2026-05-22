import { useState } from "react";
import { Lock, BookOpen, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthGateProps {
  onAuthSuccess: (code: string, token: string) => void;
}

export default function AuthGate({ onAuthSuccess }: AuthGateProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Entre ton code d'accès");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (data.status === "ok" && data.token) {
        localStorage.setItem("pv_access_code", code.trim());
        localStorage.setItem("pv_access_token", data.token);
        onAuthSuccess(code.trim(), data.token);
      } else {
        setError(data.message || "Code invalide. Réessaie.");
        triggerShake();
      }
    } catch {
      setError("Erreur de connexion. Vérifie ta connexion.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShakeInput(true);
    setTimeout(() => setShakeInput(false), 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(168,85,247,0.3) 40%, transparent 70%)",
          }}
        />
        {/* Secondary glow */}
        <div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.8) 0%, transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo icon */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.1))",
              border: "1px solid rgba(139,92,246,0.25)",
              boxShadow: "0 0 30px rgba(139,92,246,0.15), 0 0 60px rgba(139,92,246,0.05)",
            }}
          >
            <KeyRound className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Accès Formation
          </h1>
          <p className="text-sm text-gray-500">
            Entre ton code pour débloquer les modules
          </p>
        </div>

        {/* Auth card */}
        <Card
          className={cn(
            "border-white/[0.08] rounded-2xl overflow-hidden",
            "bg-[#0c0c14]/60 backdrop-blur-xl",
            "shadow-2xl shadow-black/20"
          )}
        >
          {/* Top accent line */}
          <div
            className="h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(168,85,247,0.4), transparent)",
            }}
          />

          <CardContent className="pt-6 pb-8 px-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Code input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Code d'accès
                </label>
                <div className="relative">
                  <input
                    type={showCode ? "text" : "password"}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="TON-CODE-ICI"
                    className={cn(
                      "w-full h-12 px-4 pr-11 rounded-xl text-sm",
                      "bg-white/[0.04] border border-white/[0.08]",
                      "text-white placeholder-gray-600",
                      "focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20",
                      "transition-all duration-200",
                      "font-mono tracking-widest",
                      shakeInput && "animate-shake"
                    )}
                    autoFocus
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl",
                    "bg-red-500/10 border border-red-500/20",
                    "animate-in fade-in slide-in-from-top-1 duration-200"
                  )}
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-sm",
                  "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
                  "hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500",
                  "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
                  "transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                )}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Vérification…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Débloquer la formation
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Help text */}
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                Problème d'accès ?{" "}
                <a
                  href="mailto:pokevendrepro@gmail.com"
                  className="text-purple-400/70 hover:text-purple-300 transition-colors underline underline-offset-2"
                >
                  pokevendrepro@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom branding */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-purple-500/40" />
          <span className="text-[11px] text-gray-600 font-medium">
            Pokévendre Pro — Formation
          </span>
        </div>
      </div>
    </div>
  );
}