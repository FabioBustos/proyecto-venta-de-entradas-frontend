"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TurndownService from "turndown";
import { marked } from "marked";
import { Bold, Italic, List, ListOrdered, Quote, Minus, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Code, FileCode, FileType } from "lucide-react";

type EditorMode = "visual" | "html" | "markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const turndownService = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });

turndownService.addRule("alignedParagraph", {
  filter: (node) => node.nodeName === "P" && node.style?.textAlign,
  replacement: (content, node) => {
    const align = node.style.textAlign;
    return `\n\n<p style="text-align:${align}">${content}</p>\n\n`;
  },
});

turndownService.addRule("alignedHeading", {
  filter: (node) => /^H[1-6]$/.test(node.nodeName) && node.style?.textAlign,
  replacement: (content, node) => {
    const align = node.style.textAlign;
    const hLevel = node.nodeName.charAt(1);
    return `\n\n<h${hLevel} style="text-align:${align}">${content}</h${hLevel}>\n\n`;
  },
});

function htmlToMarkdown(html: string): string {
  if (!html) return "";
  return turndownService.turndown(html);
}

function markdownToHtml(md: string): string {
  if (!md) return "";
  const normalized = md.replace(/^(#{1,6})(\S)/gm, "$1 $2");
  return marked.parse(normalized) as string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe la descripción de tu evento...",
  minHeight = "350px",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<EditorMode>("visual");
  const [sourceCode, setSourceCode] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3, 4, 5],
        },
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-editor-container ProseMirror max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML() && mode === "visual") {
      editor.commands.setContent(value || "");
    }
  }, [value, editor, mode]);

  const switchToMode = useCallback((newMode: EditorMode) => {
    if (newMode === mode) return;

    if (mode === "visual" && editor) {
      const html = editor.getHTML();
      if (newMode === "html") {
        setSourceCode(html);
      } else if (newMode === "markdown") {
        setSourceCode(htmlToMarkdown(html));
      }
    }

    if ((mode === "html" || mode === "markdown") && newMode === "visual" && editor) {
      let htmlToSet = sourceCode;
      if (mode === "markdown") {
        htmlToSet = markdownToHtml(sourceCode);
      }
      editor.commands.setContent(htmlToSet || "");
      onChange(htmlToSet || "");
    }

    if (mode === "html" && newMode === "markdown") {
      setSourceCode(htmlToMarkdown(sourceCode));
    }

    if (mode === "markdown" && newMode === "html") {
      setSourceCode(markdownToHtml(sourceCode));
    }

    setMode(newMode);
  }, [mode, editor, sourceCode, onChange]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceCode(e.target.value);
    if (mode === "html") {
      onChange(e.target.value);
    } else if (mode === "markdown") {
      onChange(markdownToHtml(e.target.value));
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {mode === "visual"
            ? "Formatea el texto usando las herramientas del editor"
            : mode === "html"
              ? "Edita el HTML directamente"
              : "Edita en formato Markdown"}
        </div>

        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => switchToMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "visual"
                ? "bg-indigo-600 text-white"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => switchToMode("html")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-l border-r border-border transition-colors ${
              mode === "html"
                ? "bg-indigo-600 text-white"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            HTML
          </button>
          <button
            type="button"
            onClick={() => switchToMode("markdown")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "markdown"
                ? "bg-indigo-600 text-white"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <FileType className="h-3.5 w-3.5" />
            Markdown
          </button>
        </div>
      </div>

      {isMounted ? (
        <div className="rounded-lg border overflow-hidden">
          {mode === "visual" && (
            <>
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive("bold")
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Negrita (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive("italic")
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Cursiva (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded border border-border text-sm font-bold ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Título 3"
                >
                  <span className="text-xs">H3</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                  className={`p-2 rounded border border-border text-sm font-bold ${
                    editor.isActive("heading", { level: 4 })
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Título 4"
                >
                  <span className="text-xs">H4</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                  className={`p-2 rounded border border-border text-sm font-bold ${
                    editor.isActive("heading", { level: 5 })
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Título 5"
                >
                  <span className="text-xs">H5</span>
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive("bulletList")
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Lista con viñetas"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive("orderedList")
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Lista numerada"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive({ textAlign: "left" })
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Alinear a la izquierda"
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Centrar"
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive({ textAlign: "right" })
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Alinear a la derecha"
                >
                  <AlignRight className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded border border-border text-sm ${
                    editor.isActive("blockquote")
                      ? "bg-indigo-600 text-white"
                      : "bg-card hover:bg-accent"
                  }`}
                  title="Cita"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="p-2 rounded border border-border text-sm bg-card hover:bg-accent"
                  title="Línea divisoria"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-2 rounded border border-border text-sm bg-card hover:bg-accent disabled:opacity-50"
                  title="Deshacer (Ctrl+Z)"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-2 rounded border border-border text-sm bg-card hover:bg-accent disabled:opacity-50"
                  title="Rehacer (Ctrl+Y)"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
              </div>

              <EditorContent
                editor={editor}
                className="focus:outline-none"
                style={{ minHeight }}
              />
            </>
          )}

          {(mode === "html" || mode === "markdown") && (
            <textarea
              value={sourceCode}
              onChange={handleSourceChange}
              placeholder={mode === "html" ? "<p>Escribe HTML aquí...</p>" : "### Título\n\nEscribe Markdown aquí..."}
              className="w-full font-mono text-sm bg-background p-4 focus:outline-none resize-y"
              style={{ minHeight }}
              spellCheck={false}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[350px] border rounded-lg bg-muted/30">
          <span className="text-muted-foreground">Cargando editor...</span>
        </div>
      )}
    </div>
  );
}


