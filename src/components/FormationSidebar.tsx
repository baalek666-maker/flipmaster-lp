import { LogOut, ChevronRight, Check, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ModuleInfo {
  id: string;
  emoji: string;
  label: string;
  title: string;
}

interface FormationSidebarProps {
  modules: ModuleInfo[];
  currentModule: string;
  completedModules: Set<string>;
  onSelectModule: (id: string) => void;
  onLogout: () => void;
}

export default function FormationSidebar({
  modules,
  currentModule,
  completedModules,
  onSelectModule,
  onLogout,
}: FormationSidebarProps) {
  const currentIndex = modules.findIndex((m) => m.id === currentModule);
  const progressPercent =
    modules.length > 0 ? Math.round(((currentIndex + 1) / modules.length) * 100) : 0;
  const completedCount = completedModules.size;

  return (
    <aside className="lg:w-[280px] flex-shrink-0 hidden lg:block">
      <div className="sticky top-6">
        <div
          className={cn(
            "rounded-2xl overflow-hidden",
            "bg-[#0c0c14]/80 backdrop-blur-xl",
            "border border-white/[0.06]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          )}
        >
          {/* Brand header */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(168,85,247,0.15))",
                  border: "1px solid rgba(139,92,246,0.25)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.15)",
                }}
              >
                <BookOpen className="w-5 h-5 text-purple-300" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white truncate">Pokévendre Pro</h2>
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                </div>
                <p className="text-[11px] text-gray-500">Formation complète</p>
              </div>
            </div>

            {/* Progress section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Progression
                </span>
                <span className="text-[11px] font-bold text-purple-300">
                  {completedCount}/{modules.length}
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2 bg-white/[0.06] rounded-full overflow-hidden [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-violet-500 [&>[data-slot=progress-indicator]]:via-purple-500 [&>[data-slot=progress-indicator]]:to-fuchsia-500 [&>[data-slot=progress-indicator]]:rounded-full [&>[data-slot=progress-indicator]]:shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              />
              <p className="text-[10px] text-gray-600">
                {progressPercent === 100
                  ? "✨ Formation terminée !"
                  : `${progressPercent}% complété`}
              </p>
            </div>
          </div>

          <Separator className="bg-white/[0.04]" />

          {/* Module list */}
          <ScrollArea className="max-h-[calc(100vh-320px)]">
            <nav className="p-2 space-y-0.5">
              {modules.map((mod, idx) => {
                const isActive = mod.id === currentModule;
                const isCompleted = completedModules.has(mod.id);
                const isLocked = idx > currentIndex + 1 && !isCompleted;

                return (
                  <Tooltip key={mod.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => !isLocked && onSelectModule(mod.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left",
                          "transition-all duration-200 group relative",
                          isActive
                            ? "bg-gradient-to-r from-violet-600/15 via-purple-600/10 to-fuchsia-600/5"
                            : "hover:bg-white/[0.03]",
                          isLocked && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        {/* Active indicator line */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                        )}

                        {/* Icon box */}
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0",
                            "transition-all duration-200",
                            isCompleted
                              ? "bg-emerald-500/10 border border-emerald-500/25"
                              : isActive
                              ? "bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-purple-500/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                              : "bg-white/[0.04] border border-white/[0.06]"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                          ) : (
                            <span className="text-base leading-none">{mod.emoji}</span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wider",
                              isActive ? "text-purple-300" : "text-gray-600"
                            )}
                          >
                            {mod.label}
                          </div>
                          <div
                            className={cn(
                              "text-[13px] font-medium truncate leading-tight",
                              isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                            )}
                          >
                            {mod.title}
                          </div>
                        </div>

                        {/* Right indicator */}
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-purple-400/60 shrink-0" />
                        )}
                        {isCompleted && !isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" />
                        )}
                      </button>
                    </TooltipTrigger>
                    {isLocked && (
                      <TooltipContent side="right" className="text-xs">
                        Termine les modules précédents
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>
          </ScrollArea>

          <Separator className="bg-white/[0.04]" />

          {/* Footer */}
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={cn(
                "w-full justify-center text-gray-600",
                "hover:text-red-400 hover:bg-red-500/5",
                "transition-all duration-200 rounded-lg h-8 text-xs"
              )}
            >
              <LogOut className="w-3 h-3 mr-1.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}