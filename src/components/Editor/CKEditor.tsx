"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import "./editor.css";

export default function CKEditorComponent({ content }: { content: string }) {
  const [editorData, setEditorData] = useState<string>(content);

  return (
    <div>
      <CKEditor
        editor={ClassicEditor as any}
        data={editorData}
        onChange={(event, editor) => {
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
          //   codeBlock: {
          //     languages: [
          //       { language: "plaintext", label: "Plain text" },
          //       { language: "javascript", label: "JavaScript" },
          //       { language: "html", label: "HTML" },
          //       { language: "css", label: "CSS" },
          //       { language: "python", label: "Python" },
          //     ],
          //   },
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:full",
              "imageStyle:side",
            ],
          },
        }}
      />
      <h3>Preview:</h3>
      <div dangerouslySetInnerHTML={{ __html: editorData }} />
    </div>
  );
}
