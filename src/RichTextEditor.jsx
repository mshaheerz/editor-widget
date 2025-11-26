"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Placeholder } from '@tiptap/extensions'

import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  LinkIcon,
  ListOrdered,
  AlignJustify,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const HEADING_OPTIONS = [
  { value: "paragraph", label: "Normal" },
  { value: "heading", level: 1, label: "Heading 1" },
  { value: "heading", level: 2, label: "Heading 2" },
  { value: "heading", level: 3, label: "Heading 3" },
  { value: "heading", level: 4, label: "Heading 4" },
  { value: "heading", level: 5, label: "Heading 5" },
  { value: "heading", level: 6, label: "Heading 6" },
];

const FONT_FAMILIES = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Courier New, monospace", label: "Courier New" },
];

const COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#cccccc",
  "#ffffff",
  "#ff0000",
  "#ff6600",
  "#ffcc00",
  "#00ff00",
  "#0066ff",
  "#6600ff",
  "#ff0066",
  "#ff3366",
  "#ff6699",
  "#66ff99",
  "#3366ff",
  "#9966ff",
];

const LinkWithStyle = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const RichTextEditor = ({
  defaultValue = "",
  value,
  onChange,
  placeholder = "Enter your text",
  minHeight = "100px",
  maxHeight = "300px",
  showDebugInfo = false,
  className = "",
  isModal = false
}) => {
  const [currentHeading, setCurrentHeading] = useState("paragraph");
  const [currentFont, setCurrentFont] = useState("Arial, sans-serif");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true,
        listItem: true,
        link: false, // disable built-in link
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      FontFamily,
      LinkWithStyle, // use our custom version instead
    ],
    immediatelyRender: false,
    content: value ?? defaultValue,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      console.log({
        html: htmlContent,
        text: editor.getText(),
        timestamp: new Date().toISOString(),
      });

      if (onChange) {
        onChange(htmlContent);
      }
    },
  });

  useEffect(() => {
    if (editor && typeof value === "string" && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const validateUrl = (url) => {
    if (!url) return true; // Empty is valid (will be handled by required check if needed)

    // More flexible URL validation that accepts:
    // - https:// format
    // - http:// format  
    // - www. format
    // - domain.com format
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    return urlPattern.test(url);
  };

  const formatUrl = (url) => {
    if (!url) return "";
    // If it doesn't have a protocol, add https://
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const handleHeadingChange = useCallback(
    (value) => {
      if (!editor) return;

      setCurrentHeading(value);

      if (value === "paragraph") {
        editor.chain().focus().setParagraph().run();
      } else {
        const option = HEADING_OPTIONS.find(
          (opt) => opt.value === "heading" && opt.label === value
        );
        if (option && "level" in option) {
          editor.chain().focus().toggleHeading({ level: option.level }).run();
        }
      }
    },
    [editor]
  );

  const handleFontChange = useCallback(
    (value) => {
      if (!editor) return;

      setCurrentFont(value);
      editor.chain().focus().setFontFamily(value).run();
    },
    [editor]
  );

  const handleColorChange = useCallback(
    (color) => {
      if (!editor) return;
      editor.chain().focus().setColor(color).run();
      setIsColorPopoverOpen(false); // Close the popover after color change
    },
    [editor]
  );

  const handleLinkUrlChange = (url) => {
    setLinkUrl(url);

    if (url && !validateUrl(url)) {
      setLinkError("Please enter a valid");
    } else {
      setLinkError("");
    }
  };

  const handleLinkInsert = useCallback(() => {
    if (!editor || !linkUrl) return;

    if (!validateUrl(linkUrl)) {
      setLinkError("Please enter a valid URL");
      return;
    }

    const formattedUrl = formatUrl(linkUrl);
    editor.chain().focus().setLink({ href: formattedUrl }).run();
    setLinkUrl("");
    setLinkError("");
    setIsLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      // Update heading state
      if (editor.isActive("heading", { level: 1 })) {
        setCurrentHeading("Heading 1");
      } else if (editor.isActive("heading", { level: 2 })) {
        setCurrentHeading("Heading 2");
      } else if (editor.isActive("heading", { level: 3 })) {
        setCurrentHeading("Heading 3");
      } else if (editor.isActive("heading", { level: 4 })) {
        setCurrentHeading("Heading 4");
      } else if (editor.isActive("heading", { level: 5 })) {
        setCurrentHeading("Heading 5");
      } else if (editor.isActive("heading", { level: 6 })) {
        setCurrentHeading("Heading 6");
      } else {
        setCurrentHeading("paragraph");
      }
    };

    editor.on("selectionUpdate", updateStates);
    editor.on("transaction", updateStates);

    return () => {
      editor.off("selectionUpdate", updateStates);
      editor.off("transaction", updateStates);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn(className, "w-full  mx-auto border border-border rounded-lg overflow-hidden")}>
      {/* Toolbar */}
      <div className={"flex flex-wrap items-center gap-1 p-2 bg-brand-25  border-border"}>
        {/* Heading Selector */}
        <Select value={currentHeading} onValueChange={handleHeadingChange}>
          <SelectTrigger className="w-32 border-none shadow-none focus:bg-brand-50 focus:ring-0 data-[state=open]:bg-brand-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Normal</SelectItem>
            {HEADING_OPTIONS.slice(1).map((option) => (
              <SelectItem
                key={option.label}
                value={option.label}
                style={{
                  fontSize: option.level === 1 ? '1.5rem' :
                    option.level === 2 ? '1.25rem' :
                      option.level === 3 ? '1.125rem' :
                        option.level === 4 ? '1rem' :
                          option.level === 5 ? '0.875rem' :
                            option.level === 6 ? '0.75rem' : '1rem',
                  fontWeight: option.level ? 'bold' : 'normal'
                }}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Family Selector */}
        <Select value={currentFont} onValueChange={handleFontChange}>
          <SelectTrigger className="w-32 border-none shadow-none focus:bg-brand-50 focus:ring-0 data-[state=open]:bg-brand-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem
                key={font.value}
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          className={
            editor.isActive("bold") ? "bg-primary text-primary-foreground" : ""
          }
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          className={
            editor.isActive("italic")
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
          className={
            editor.isActive("underline")
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
          className={
            editor.isActive("strike")
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Color */}
        <Popover modal={isModal} open={isColorPopoverOpen} onOpenChange={setIsColorPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Link */}
        <Popover
          modal={true}
          open={isLinkPopoverOpen}
          onOpenChange={setIsLinkPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              // focus input manually
              const input = document.getElementById("link-url");
              input?.focus();
            }}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="w-80"
          >
            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => handleLinkUrlChange(e.target.value)}
                placeholder="https://example.com"
                error={linkError}
              />
              <Button
                onClick={handleLinkInsert}
                className="w-full"
                disabled={!linkUrl || !!linkError}
              >
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleList("bulletList", "listItem").run()
          }
          aria-label="Bullet List"
          className={
            editor.isActive("bulletList")
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleList("orderedList", "listItem").run()
          }
          aria-label="Numbered List"
          className={
            editor.isActive("orderedList")
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Alignment */}
        <Toggle
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          aria-label="Align Left"
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          aria-label="Align Center"
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          aria-label="Align Right"
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          aria-label="Justify"
          className={
            editor.isActive({ textAlign: "justify" })
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </div>
      {/* Editor Content */}

      <EditorContent
        editor={editor}
        className="editor sp p-2    [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[var(--prose-mirror-min-height)] [&_.ProseMirror]:max-h-[var(--prose-mirror-max-height,var(--prose-mirror-min-height))] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:p-2 "
        style={{
          minHeight,
          maxHeight,
          ["--prose-mirror-min-height"]: minHeight,
          ["--prose-mirror-max-height"]: maxHeight
        }}
        placeholder={placeholder}
      />

      {/* Debug Info */}
      {showDebugInfo && (
        <div className="p-4 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground">
            HTML content is logged to console as an object. Open DevTools to see
            the output.
          </p>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
