"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";

interface Props {
  onChange: (newContent: string) => void;
  content: string;
}


const Tiptap = ({ onChange, content }: Props) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
    console.log(newContent);
  };
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    content
  });

  return (
    <div className="w-full px-4">
      <Toolbar editor={editor} content={content} />
      <EditorContent  style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default Tiptap;

