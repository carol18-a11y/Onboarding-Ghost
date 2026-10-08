import * as React from "react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-center h-full w-full overflow-hidden rounded-[28px] sm:rounded-3xl p-8 sm:p-10 min-h-[300px] sm:min-h-[330px] transition-shadow duration-300 hover:shadow-2xl border border-white/10 shadow-lg text-white",
  {
    variants: {
      gradient: {
        purple: "bg-[#7c3aed]", // Solid Vibrant Purple
        orange: "bg-[#ea580c]", // Solid Vibrant Orange
        pink: "bg-[#db2777]",   // Solid Vibrant Pink
        cyan: "bg-[#0891b2]",   // Solid Vibrant Cyan
      },
    },
    defaultVariants: {
      gradient: "purple",
    },
  }
);

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
  description: string;
  isDark?: boolean;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "purple", title, description, isDark = false, ...props }, ref) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setTilt({
        x: -(y / (rect.height / 2)) * 10,
        y: (x / (rect.width / 2)) * 10,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    };

    return (
      <div style={{ perspective: 1000 }} className="h-full w-full">
        <motion.div
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            scale: isHovered ? 1.03 : 1,
            y: isHovered ? -4 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="h-full cursor-pointer"
          ref={ref}
        >
          <div
            className={cn(
              cardVariants({ gradient }),
              className
            )}
            {...props}
          >
            <div className="z-10 flex flex-col justify-center h-full items-start text-left py-4">
              <h3 className="text-xl sm:text-2xl md:text-[26px] font-extrabold mb-4 tracking-tight text-white leading-snug">
                {title}
              </h3>
              <p className="text-base sm:text-[17px] leading-relaxed text-white/95 font-medium">
                {description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

GradientCard.displayName = "GradientCard";
export { GradientCard, cardVariants };
