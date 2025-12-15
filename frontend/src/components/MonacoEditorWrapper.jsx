import Editor from "@monaco-editor/react";

export default function MonacoEditorWrapper({ value }) {
  return (
    <Editor
      height="500px"
      defaultLanguage="markdown"
      theme="vs-dark"
      value={value}
      options={{
        readOnly: true,
        minimap: { enabled: false },
      }}
    />
  );
}
