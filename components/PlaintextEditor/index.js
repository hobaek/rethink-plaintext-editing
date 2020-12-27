import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ControlledEditor } from '@monaco-editor/React';
import css from './style.css';

function PlaintextEditor({ file, write }) {
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
        language="plaintext"
        onChange={handleChange}
      />
      <button
        onClick={() => handleSubmmit(newFile)}
        // style={{ position: 'relative', right: -500, color: 'red' }}
      >
        save
      </button>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
