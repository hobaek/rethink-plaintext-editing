import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ControlledEditor } from '@monaco-editor/React';
import css from './style.css';

function MarkdownEditor({ file, write }) {
  const [newFile, setNewFile] = useState('');

  useEffect(() => {
    (async () => {
      setNewFile(await file.text());
    })();
  }, [file]);

  const handleChange = (e, value) => {
    setNewFile(value);
  };

  const handleSubmmit = value => {
    write(
      new File([value], file.name, {
        lastModified: Date.now(),
        type: file.type
      })
    );
  };

  return (
    <div className={css.editor}>
      <ControlledEditor
        value={newFile}
        width="100%"
        height="90vh"
        language="javascript"
        onChange={handleChange}
      />
      <button
        onClick={() => handleSubmmit(newFile)}
        style={{ position: 'absolute', right: 210, color: 'red' }}
      >
        save
      </button>
    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
