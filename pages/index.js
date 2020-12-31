import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';

// Used below, these need to be registered
import MarkdownEditor from '../MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile }) {
  const [query, setQuery] = useState('');

  const sortedFiles = files.filter(data => {
    return data.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });

  const handleChange = q => setQuery(q);

  return (
    <div className={css.files}>
      <input
        type="text"
        placeholder="Search specific file by name"
        onChange={e => handleChange(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  'text/plain': PlaintextEditor,
  'text/markdown': MarkdownEditor
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    (async () => {
      const files = listFiles();
      const storedFiles = JSON.parse(localStorage.getItem('files'));

      if (storedFiles === null || storedFiles.length === 0) {
        setFiles(files);
      } else {
        const newFiles = files.map(file => {
          const fileIndex = storedFiles.findIndex(f => f.name === file.name);

          if (fileIndex === -1) return file;

          const changedFile = storedFiles[fileIndex];
          const newFile = new File([changedFile.text], file.name, {
            type: changedFile.type,
            lastModified: changedFile.lastModified
          });

          return newFile;
        });

        setFiles(newFiles);
      }
    })();
  }, []);

  const write = async file => {
    console.log('Writing soon... ', file.name);
    const newFiles = files.slice();
    // TODO: Write the file to the `files` array
    const fileIndex = files.findIndex(f => f.name === file.name);
    if (fileIndex !== -1) {
      newFiles[fileIndex] = file;
      setFiles(newFiles);
    } else {
      setFiles([...files, file]);
    }

    const newFile = {
      name: file.name,
      text: await file.text(),
      type: file.type,
      lastModified: file.lastModified
    };
    let storedFiles = JSON.parse(localStorage.getItem('files'));
    storedFiles
      ? (storedFiles[fileIndex] = newFile)
      : (storedFiles = [newFile]);

    localStorage.setItem('files', JSON.stringify(storedFiles));
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
            <h5>Edit and Click the save button in editor</h5>
            <h5>When you click the button your storage will be clear</h5>
          </div>
        </header>

        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'http://localhost:3000';
          }}
        >
          Click for clear LocalStorage Files
        </button>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && <Previewer file={activeFile} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
