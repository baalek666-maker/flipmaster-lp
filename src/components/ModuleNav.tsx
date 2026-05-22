import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModuleNavProps {
  modules: { id: string; label: string; title: string }[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function ModuleNav({
  modules,
  currentIndex,
  onPrev,
  onNext,
}: ModuleNavProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < modules.length - 1;
  const current = modules[currentIndex];

  return (
    <div
      className={cn(
        "mt-8 mb-4 rounded-2xl p-4",
        "bg-[#0c0c14]/60 backdrop-blur-lg",
        "border border-white/[0.06]",
        "flex items-center justify-between gap-4"
      )}
    >
      {/* Previous */}
      <Button
        variant="ghost"
        onClick={onPrev}
        disabled={!hasPrev}
        className={cn(
          "gap-1.5 min-w-[120px]",
          "text-gray-400 hover:text-white",
          "hover:bg-white/[0.04]",
          "transition-all duration-200 rounded-xl",
          "disabled:opacity-20 disabled:cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Précédent</span>
      </Button>

      {/* Center: current module indicator */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {modules.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-full transition-all duration-500",
                idx === currentIndex
                  ? "w-6 h-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  : idx < currentIndex
                  ? "w-1.5 h-1.5 bg-emerald-500/50"
                  : "w-1.5 h-1.5 bg-white/10"
              )}
            />
          ))}
        </div>
        {current && (
          <span className="text-[11px] text-gray-500 font-medium">
            {current.label} — {current.title}
          </span>
        )}
      </div>

      {/* Next */}
      <Button
        onClick={onNext}
        disabled={!hasNext}
        className={cn(
          "gap-1.5 min-w-[120px] font-semibold",
          "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
          "hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500",
          "shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40",
          "transition-all duration-300 rounded-xl",
          "disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        )}
      >
        <span className="text-sm">Suivant</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}