"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./editor.css";

export default function CKEditorComponent({ content }: { content: string }) {
  const [editorData, setEditorData] = useState<string>(content);
  const [EditorLoaded, setEditorLoaded] = useState(false);
  const [CKEditor, setCKEditor] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);

  useEffect(() => {
    const loadEditor = async () => {
      const { CKEditor } = await import("@ckeditor/ckeditor5-react");
      const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic"))
        .default;
      setCKEditor(() => CKEditor);
      setClassicEditor(() => ClassicEditor);
      setEditorLoaded(true);
    };

    loadEditor();
  }, []);

  if (!EditorLoaded || !CKEditor || !ClassicEditor)
    return <p>Loading editor...</p>;

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          setEditorData(data);
        }}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "insertTable",
            "imageUpload",
            "codeBlock",
            "undo",
            "redo",
          ],
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:full",
              "imageStyle:side",
            ],
          },
        }}
      />
    </div>
  );
}
