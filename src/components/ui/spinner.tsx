// app/components/Spinner.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
// TODO: implement in pages
export default function Spinner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
          "h-8 w-8"
        )} />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}