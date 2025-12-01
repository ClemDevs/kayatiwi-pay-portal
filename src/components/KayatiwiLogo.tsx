import { cn } from "@/lib/utils";

interface KayatiwiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const KayatiwiLogo = ({ className, size = "md" }: KayatiwiLogoProps) => {
  const sizes = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full border-4 border-primary bg-white flex items-center justify-center font-heading font-bold text-primary",
        sizes[size]
      )}>
        K
      </div>
      <span className="font-heading font-bold text-foreground tracking-tight">
        Kayatiwi
      </span>
    </div>
  );
};
