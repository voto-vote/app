import { Children } from "react";

export default function BottomBar({ children }: { children: React.ReactNode }) {
  const numberOfChildren = Children.toArray(children).length;
  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-accent/50 z-10 border-t">
      <div
        className={`container mx-auto max-w-3xl flex items-center py-2 px-2 md:px-0 text-primary text-base [&_button]:px-2 [&_button]:py-1 [&_button]:size-fit hover:[&_button]:text-primary ${numberOfChildren > 1 ? "justify-between" : "justify-center"}`}
      >
        {children}
      </div>
    </div>
  );
}
