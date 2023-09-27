import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function RoleDescriptionEditor() {
  const [editorHtml, setEditorHtml] = useState('');

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  return (
    <div className="form-group">
      <ReactQuill
        value={editorHtml}
        onChange={handleChange}
        modules={RoleDescriptionEditor.modules}
        formats={RoleDescriptionEditor.formats}
        theme="snow"
      />
    </div>
  );
}

RoleDescriptionEditor.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link'],
  ],
};

RoleDescriptionEditor.formats = [
  'header',
  'list',
  'bold',
  'italic',
  'underline',
  'link',
];

export default RoleDescriptionEditor;
