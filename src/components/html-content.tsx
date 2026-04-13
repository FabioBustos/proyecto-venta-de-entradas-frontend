"use client";

import { cn } from "@/lib/utils";

interface HtmlContentProps {
  html: string;
  className?: string;
}

const downgradeMap: Record<string, string> = {
  h1: "h3",
  h2: "h4",
};

const upgradeMap: Record<string, string> = {
  h3: "h1",
  h4: "h2",
  h5: "h3",
};

export function downgradeHeadings(html: string): string {
  return html.replace(/<\/?(h[1-6])(\s[^>]*)?\/?>/gi, (match, tag, attrs) => {
    const isClosing = match.startsWith("</");
    const newTag = downgradeMap[tag.toLowerCase()] || tag;
    if (newTag === tag) return match;
    const attrStr = attrs || "";
    return isClosing ? `</${newTag}>` : `<${newTag}${attrStr}>`;
  });
}

export function upgradeHeadings(html: string): string {
  return html.replace(/<\/?(h[1-6])(\s[^>]*)?\/?>/gi, (match, tag, attrs) => {
    const isClosing = match.startsWith("</");
    const newTag = upgradeMap[tag.toLowerCase()] || tag;
    if (newTag === tag) return match;
    const attrStr = attrs || "";
    return isClosing ? `</${newTag}>` : `<${newTag}${attrStr}>`;
  });
}

export function HtmlContent({ html, className = "" }: HtmlContentProps) {
  if (!html) return null;

  return (
    <div
      className={cn("prose-html", className)}
      dangerouslySetInnerHTML={{ __html: downgradeHeadings(html) }}
    />
  );
}