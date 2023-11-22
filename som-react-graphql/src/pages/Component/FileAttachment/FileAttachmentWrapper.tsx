import React, { useState } from 'react';

import styles from './FileAttachment.module.css';

interface Attachment {
  name: string;
  path: string;
};

const FileAttachment = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const newAttachments: Attachment[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const attachment = {
          name: file.name,
          path: URL.createObjectURL(file),
        };
        newAttachments.push(attachment);
      }

      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const deleteAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type="file"
        id="file-input"
        className="d-none"
        onChange={handleFileSelect}
      />

      <img
        src="/assets/images/edit_shipping/u417.svg"
        alt="Click to choose a file"
        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        className="mt-n2"
        onClick={() => document.getElementById('file-input')?.click()}
      />

      {attachments.map((attachment, index) => (
        <div className="d-flex mb-1" key={index}>
          <span className={styles.filename}>{attachment.name}</span>
          <span className={styles["delete-icon"]} onClick={() => deleteAttachment(index)}>
            X
          </span>
        </div>
      ))}
    </div>
  );
};

export default FileAttachment;
