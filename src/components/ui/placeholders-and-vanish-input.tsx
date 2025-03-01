"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod"; // Import zod

// Define validation schema
const searchSchema = z.object({
  query: z.string().min(3, "Search must be at least 3 characters")
});

// type SearchSchema = z.infer<typeof searchSchema>;

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, value: string) => void;
}) {
  // State management
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<Array<{x: number, y: number, r: number, color: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Placeholder animation logic
  const startPlaceholderAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startPlaceholderAnimation();
    }
  }, [startPlaceholderAnimation]);

  // Initialize placeholder animation
  useEffect(() => {
    startPlaceholderAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startPlaceholderAnimation, handleVisibilityChange]);

  // Canvas drawing logic for vanishing animation
  const drawToCanvas = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas
    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    
    // Get input styles for text rendering
    const computedStyles = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    // Extract pixel data for animation
    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: Array<{x: number, y: number, color: number[]}> = [];

    // Find all visible pixels
    for (let y = 0; y < 800; y++) {
      const rowOffset = 4 * y * 800;
      for (let x = 0; x < 800; x++) {
        const pixelOffset = rowOffset + 4 * x;
        if (
          pixelData[pixelOffset] !== 0 ||
          pixelData[pixelOffset + 1] !== 0 ||
          pixelData[pixelOffset + 2] !== 0
        ) {
          newData.push({
            x,
            y,
            color: [
              pixelData[pixelOffset],
              pixelData[pixelOffset + 1],
              pixelData[pixelOffset + 2],
              pixelData[pixelOffset + 3],
            ],
          });
        }
      }
    }

    // Convert to drawing points
    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  // Update canvas when value changes
  useEffect(() => {
    drawToCanvas();
  }, [value, drawToCanvas]);

  // Vanishing animation
  const animate = (startPosition: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        
        // Update particle positions
        for (let i = 0; i < newDataRef.current.length; i++) {
          const particle = newDataRef.current[i];
          
          if (particle.x < pos) {
            newArr.push(particle);
          } else {
            if (particle.r <= 0) {
              continue;
            }
            
            // Randomly move and shrink particles
            particle.x += Math.random() > 0.5 ? 1 : -1;
            particle.y += Math.random() > 0.5 ? 1 : -1;
            particle.r -= 0.05 * Math.random();
            newArr.push(particle);
          }
        }
        
        newDataRef.current = newArr;
        
        // Render updated particles
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((particle) => {
            const { x, y, r, color } = particle;
            if (x > pos) {
              ctx.beginPath();
              ctx.rect(x, y, r, r);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        
        // Continue animation if particles remain
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    
    animateFrame(startPosition);
  };

  // Input handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      handleValidationAndSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (animating) return;
    
    setValue(e.target.value);
    setError(null); // Clear error on change
    
    if (onChange) {
      onChange(e);
    }
  };

  // Validation and submission
  const handleValidationAndSubmit = () => {
    try {
      // Validate input
      searchSchema.parse({ query: value });
      setError(null);
      
      // Proceed with animation and submission
      setAnimating(true);
      drawToCanvas();

      if (value && inputRef.current) {
        const maxX = newDataRef.current.reduce(
          (prev, current) => (current.x > prev ? current.x : prev),
          0
        );
        animate(maxX);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleValidationAndSubmit();
    
    if (!error && onSubmit) {
      onSubmit(e, value);
    }
  };

  const handleSearchClick = () => {
    handleValidationAndSubmit();
    
    if (!error && onSubmit && inputRef.current) {
      // Create a synthetic form event
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      onSubmit(syntheticEvent, value);
    }
  };

  return (
    <div className="flex flex-col">
      <form
        className={cn(
          "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 min-h-12 rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
          value && "bg-gray-50",
          error && "ring-2 ring-red-500"
        )}
        onSubmit={handleSubmit}
      >
        {/* Canvas for vanishing animation */}
        <canvas
          className={cn(
            "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
            animating ? "opacity-100" : "opacity-0"
          )}
          ref={canvasRef}
        />
        
        {/* Search input */}
        <input
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          type="text"
          className={cn(
            "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-8 pr-20",
            "focus:ring-1",
            animating && "text-transparent dark:text-transparent",
            error ? "focus:ring-red-500" : "focus:ring-black dark:focus:ring-zinc-500"
          )}
        />

        {/* Submit button */}
        <button
          disabled={!value || !!error}
          type="button"
          onClick={handleSearchClick}
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-search"
          >
            <motion.circle fill="none" stroke="#fff" cx="11" cy="11" r="8"/>
            <motion.path 
              d="m21 21-4.3-4.3"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%",
              }}
              animate={{
                strokeDashoffset: value ? 0 : "50%",
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              stroke="white"
              fill="white"
            />
          </motion.svg>
        </button>

        {/* Placeholder animation */}
        <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
          <AnimatePresence mode="wait">
            {!value && (
              <motion.p
                initial={{
                  y: 5,
                  opacity: 0,
                }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "linear",
                }}
                className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-8 text-left w-[calc(100%-2rem)] truncate"
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center w-full text-red-500 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}
      </form>
      
    </div>
  );
}