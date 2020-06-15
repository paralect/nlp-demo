import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { getFileDataUrl } from 'helpers/helpers';

import styles from './fileDropzone.styles';

/* eslint-disable react/jsx-props-no-spreading */
const FileDropzone = (props) => {
  const { file, onChange } = props;

  // Save file data URL to state
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    if (file) {
      getFileDataUrl(file).then((dataUrl) => setPreviewUrl(dataUrl));
    }
  }, [file]);

  const [error, setError] = useState(null);
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onChange(acceptedFiles.pop());
      setError(null);
    }
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles.pop().errors.pop().message;
      setError(err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: ['image/png', 'image/jpeg'],
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className={styles.container}>
      <div
        className={classnames(styles.fileDropzone, {
          [styles.dragActive]: isDragAccept,
          [styles.error]: !!error,
        })}
        {...getRootProps()}
      >

        <input {...getInputProps()} />
        <motion.div
          animate={{
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
            loop: Infinity,
            repeatDelay: 1,
          }}
        >
          <FaCloudUploadAlt className={styles.uploadIcon} size={28} />
        </motion.div>
        <div className={styles.uploadTitle}>Upload another image</div>
      </div>
      <div className={styles.shade} />

      {error && <div className={styles.errorText}>{error}</div>}
      {previewUrl && <img className={styles.preview} src={previewUrl} alt="preview" />}
    </div>
  );
};

FileDropzone.propTypes = {
  onChange: PropTypes.func.isRequired,
  file: PropTypes.objectOf(PropTypes.any),
};

FileDropzone.defaultProps = {
  file: null,
};

export default FileDropzone;
