import React from 'react';
import Editor from '@monaco-editor/react';

export default function MonacoEditorWrapper({ value }) {
  return <Editor height="400px" defaultLanguage="markdown" value={value} options={{ readOnly: true }} />;
};