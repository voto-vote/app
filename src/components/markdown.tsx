import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import breaks from "remark-breaks";
import { cn } from "@/lib/utils";

export default function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  // Use remark to convert markdown into HTML string
  const processedContent = remark()
    .use(html)
    .use(gfm)
    .use(breaks)
    .processSync(content);
  const contentHtml = processedContent.toString();

  return (
    <div
      className={cn("prose max-w-full", className)}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
