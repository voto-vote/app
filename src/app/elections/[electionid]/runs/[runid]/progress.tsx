import { useEffect, useRef, useState, MouseEvent, TouchEvent } from "react";

interface ProgressProps {
  total: number;
  current: number;
  onChange: (current: number) => void;
}

export default function Progress({ total, current, onChange }: ProgressProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const progressDotsRef = useRef<HTMLDivElement>(null);

  // Calculate min and max translateX values (from the center of the progress dots)
  // lastIndex = total - 1
  // middleIndex = lastIndex / 2
  // minTranslateX = -middleIndex * 12 (8px is the width of a dot + 4px spacing)
  const minTranslateX = -((total - 1) / 2) * 12;
  // maxTranslateX = middleIndex * 12 (8px is the width of a dot + 4px spacing)
  const maxTranslateX = ((total - 1) / 2) * 12;

  // Handle mouse down event
  const handleMouseDown = (e: MouseEvent) => {
    if (!progressDotsRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX - translateX);
    e.preventDefault();
  };

  // Handle touch start event
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1 || !progressDotsRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX - translateX);
  };

  // Watch for changes in current values and apply the translation
  useEffect(() => {
    if (isDragging) return;
    // Center the progress dots
    // lastIndex = total - 1
    // middleIndex = lastIndex / 2
    // translationX = middleIndex - current * 12 (8px is the width of a dot + 4px spacing)
    setTranslateX(((total - 1) / 2 - current) * 12);
  }, [total, current, isDragging]);

  // Add and remove event listeners
  useEffect(() => {
    // Handle mouse move event
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      const newPosition = Math.min(
        maxTranslateX,
        Math.max(minTranslateX, e.clientX - startX)
      );
      setTranslateX(newPosition);
      const newIndex = Math.round(
        Math.abs(newPosition - ((total - 1) * 12) / 2) / 12
      );
      if (newIndex !== current) {
        onChange(newIndex);
      }
    };

    // Handle touch move event
    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const newPosition = Math.min(
        maxTranslateX,
        Math.max(minTranslateX, e.touches[0].clientX - startX)
      );
      setTranslateX(newPosition);
      e.preventDefault();
      const newIndex = Math.round(
        Math.abs(newPosition - ((total - 1) * 12) / 2) / 12
      );
      if (newIndex !== current) {
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
        onChange(newIndex);
      }
    };

    // Handle mouse up and touch end events
    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleDragEnd);
      document.addEventListener("touchcancel", handleDragEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleDragEnd);
      document.removeEventListener("touchcancel", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleDragEnd);
      document.removeEventListener("touchcancel", handleDragEnd);
    };
  }, [
    current,
    isDragging,
    maxTranslateX,
    minTranslateX,
    onChange,
    startX,
    total,
  ]);

  return (
    <div>
      <div
        ref={progressDotsRef}
        className="flex justify-center gap-1 -mx-4 py-2 touch-none"
        style={{
          transform: `translateX(${translateX}px)`,
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "transform 0.3s",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {Array.from({ length: total }).map((_, i) => (
          // lastIndex = total - 1
          // width of the dots (only the width that can be moved around) = lastIndex * 12 (8px is the width of a dot + 4px spacing)
          // center the dots = width of the dots / 2
          // aligned scale (converts translationX from -24..24 to 0..48) = abs(translationX - center of the dots)
          // dotindex (converts pixel translation to index) = aligned scale / 12
          // dotindexprecise = round(dotindex)
          <div
            key={i}
            className={`size-2 rounded-full transition ${Math.round(Math.abs(translateX - ((total - 1) * 12) / 2) / 12) === i ? "bg-votopurple-500" : "bg-zinc-300 dark:bg-votopurple-800"}`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {current + 1} / {total}
      </p>
    </div>
  );
}
