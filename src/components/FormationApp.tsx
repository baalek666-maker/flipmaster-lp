import { useState, useEffect, useCallback, useRef } from "react";
import { BookOpen, AlertTriangle, Menu, X, GraduationCap, Sparkles } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import FormationSidebar, { type ModuleInfo } from "@/components/FormationSidebar";
import ModuleNav from "@/components/ModuleNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const MODULE_ORDER: ModuleInfo[] = [
  { id: "module-0", emoji: "\u{1F680}", label: "Module 0", title: "Introduction" },
  { id: "module-1", emoji: "\u{1F4CA}", label: "Module 1", title: "Les Fondamentaux" },
  { id: "module-2", emoji: "\u{1F3AF}", label: "Module 2", title: "Strat\u00e9gie d'Achat" },
  { id: "module-3", emoji: "\u{1F4B0}", label: "Module 3", title: "Revente & Profit" },
  { id: "module-4", emoji: "\u{1F4C8}", label: "Module 4", title: "Optimisation" },
  { id: "bonus", emoji: "\u{1F381}", label: "Bonus", title: "Ressources Bonus" },
];

export default function FormationApp() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentModule, setCurrentModule] = useState("module-0");
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialModule, setInitialModule] = useState<string | null>(null);
  const moduleCache = useRef<Record<string, string>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  // On mount: check for stored code/token
  useEffect(() => {
    const storedCode = localStorage.getItem("pv_access_code") || "";
    const storedToken = localStorage.getItem("pv_access_token") || "";

    if (storedCode && storedToken) {
      fetch("/api/check-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: storedCode, token: storedToken }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "ok") {
            setIsAuthed(true);
            setInitialModule("module-0");
          } else {
            localStorage.removeItem("pv_access_code");
            localStorage.removeItem("pv_access_token");
          }
        })
        .catch(() => {});
    }
  }, []);

  const loadModule = useCallback(async (moduleId: string) => {
    setCurrentModule(moduleId);
    setLoading(true);
    setError(null);

    setCompletedModules((prev) => {
      const next = new Set(prev);
      next.add(moduleId);
      return next;
    });

    if (moduleCache.current[moduleId]) {
      if (contentRef.current) {
        contentRef.current.innerHTML = moduleCache.current[moduleId];
        appleRestructure(contentRef.current);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const accessCode = localStorage.getItem("pv_access_code") || "";
    const accessToken = localStorage.getItem("pv_access_token") || "";

    try {
      const res = await fetch(`/api/module/${moduleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode, token: accessToken }),
      });

      if (!res.ok) throw new Error("Acc\u00e8s non autoris\u00e9");
      const data = await res.json();

      if (data.status !== "ok") throw new Error(data.message || "Erreur d'acc\u00e8s");

      moduleCache.current[moduleId] = data.html;
      if (contentRef.current) {
        contentRef.current.innerHTML = data.html;
        appleRestructure(contentRef.current);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial module AFTER isAuthed is true
  useEffect(() => {
    if (initialModule && isAuthed) {
      const mod = initialModule;
      setInitialModule(null);
      // Use requestAnimationFrame to ensure contentRef is mounted in the DOM
      // before loadModule tries to write into it
      requestAnimationFrame(() => {
        loadModule(mod);
      });
    }
  }, [initialModule, isAuthed, loadModule]);

  // Premium module content restructure
  const appleRestructure = (container: HTMLElement) => {
    container.querySelectorAll(".section-panel").forEach((panel) => {
      const children = Array.from(panel.children);
      const cards: Element[] = [];
      let currentCard: Element | null = null;
      const headerEls: Element[] = [];

      children.forEach((el) => {
        if (el.classList.contains("section-header")) {
          if (currentCard) { cards.push(currentCard); currentCard = null; }
          headerEls.push(el);
        } else if (
          el.classList.contains("split-row") ||
          el.classList.contains("table-wrap") ||
          el.classList.contains("rule-box") ||
          el.classList.contains("stat-row")
        ) {
          if (currentCard) { cards.push(currentCard); currentCard = null; }
          cards.push(el);
        } else if (el.classList.contains("lesson-intro") || el.tagName === "H3") {
          if (currentCard) { cards.push(currentCard); currentCard = null; }
          currentCard = el;
        } else {
          if (!currentCard) {
            currentCard = el;
          } else {
            if (currentCard.classList && currentCard.classList.contains("apple-card-inner")) {
              currentCard.appendChild(el);
            } else {
              const wrap = document.createElement("div");
              wrap.className = "apple-card-inner";
              panel.insertBefore(wrap, currentCard);
              wrap.appendChild(currentCard);
              wrap.appendChild(el);
              if (currentCard.parentNode !== wrap) wrap.appendChild(currentCard);
              currentCard = wrap;
            }
          }
        }
      });

      if (currentCard) cards.push(currentCard);

      const fragment = document.createDocumentFragment();
      headerEls.forEach((h) => fragment.appendChild(h));
      cards.forEach((c, i) => {
        if (c.classList && c.classList.contains("apple-card")) {
          c.setAttribute("style", `animation-delay: ${i * 80}ms`);
          fragment.appendChild(c);
        } else {
          const card = document.createElement("div");
          card.className = "apple-card";
          card.setAttribute("style", `animation-delay: ${i * 80}ms`);
          card.appendChild(c);
          fragment.appendChild(card);
        }
      });

      panel.innerHTML = "";
      panel.appendChild(fragment);
      panel.classList.add("apple-section");
    });

    // Stagger-animate cards on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    container.querySelectorAll(".apple-card, .lesson-intro, .rule-box, .stat-row > *, .split-row > *").forEach((el) => {
      el.classList.add("card-reveal");
      observer.observe(el);
    });
  };

  const handleAuthSuccess = (_code: string, _token: string) => {
    setIsAuthed(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    window.history.replaceState({}, "", url);
    setInitialModule("module-0");
  };

  const handleLogout = () => {
    localStorage.removeItem("pv_access_code");
    localStorage.removeItem("pv_access_token");
    setIsAuthed(false);
    setCurrentModule("module-0");
    setCompletedModules(new Set());
    moduleCache.current = {};
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    window.history.replaceState({}, "", url);
  };

  const currentIndex = MODULE_ORDER.findIndex((m) => m.id === currentModule);

  if (!isAuthed) {
    return <AuthGate onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen gap-0">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full pt-2 px-2">
            <FormationSidebar
              modules={MODULE_ORDER}
              currentModule={currentModule}
              completedModules={completedModules}
              onSelectModule={(id) => {
                loadModule(id);
                setSidebarOpen(false);
              }}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Desktop sidebar */}
        <FormationSidebar
          modules={MODULE_ORDER}
          currentModule={currentModule}
          completedModules={completedModules}
          onSelectModule={(id) => loadModule(id)}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <div
            className={cn(
              "lg:hidden sticky top-0 z-30",
              "flex items-center justify-between px-4 py-3",
              "bg-[#050507]/80 backdrop-blur-xl",
              "border-b border-white/[0.06]"
            )}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                "p-2 rounded-xl transition-colors",
                "hover:bg-white/[0.06] text-gray-400"
              )}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                {MODULE_ORDER[currentIndex]?.title}
              </span>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/20 px-2"
            >
              {MODULE_ORDER[currentIndex]?.label}
            </Badge>
          </div>

          {/* Content area */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
            {/* Module header */}
            <div className="mb-8 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.1))",
                  border: "1px solid rgba(139,92,246,0.2)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.1)",
                }}
              >
                {MODULE_ORDER[currentIndex]?.emoji}
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/20 mb-1.5"
                >
                  {MODULE_ORDER[currentIndex]?.label}
                </Badge>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {MODULE_ORDER[currentIndex]?.title}
                </h1>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-white/[0.04] rounded-xl w-3/4" />
                <div className="h-4 bg-white/[0.04] rounded-lg w-full" />
                <div className="h-4 bg-white/[0.04] rounded-lg w-5/6" />
                <div className="h-32 bg-white/[0.04] rounded-2xl w-full mt-6" />
                <div className="h-4 bg-white/[0.04] rounded-lg w-2/3" />
                <div className="h-24 bg-white/[0.04] rounded-2xl w-full" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <Card
                className={cn(
                  "border-red-500/20 bg-red-500/5 backdrop-blur-lg rounded-2xl",
                  "animate-in fade-in zoom-in-95 duration-300"
                )}
              >
                <CardContent className="flex items-start gap-3 py-5">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Erreur de chargement</p>
                    <p className="text-gray-500 text-xs mt-1">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Module content — always mounted so contentRef stays valid */}
            <div
              ref={contentRef}
              id="module-content"
              className="prose-custom"
              style={{ display: loading || error ? "none" : "block" }}
            />

            {/* Module navigation */}
            {!loading && !error && (
              <ModuleNav
                modules={MODULE_ORDER}
                currentIndex={currentIndex}
                onPrev={() => {
                  if (currentIndex > 0) loadModule(MODULE_ORDER[currentIndex - 1].id);
                }}
                onNext={() => {
                  if (currentIndex < MODULE_ORDER.length - 1)
                    loadModule(MODULE_ORDER[currentIndex + 1].id);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
