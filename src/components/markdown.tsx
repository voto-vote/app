import { remark } from "remark";
import html from "remark-html";

export default function Markdown({ content }: { content: string }) {
  // Use remark to convert markdown into HTML string
  const processedContent = remark().use(html).processSync(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
