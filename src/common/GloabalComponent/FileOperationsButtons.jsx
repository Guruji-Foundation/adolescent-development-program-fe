import React, { useState, useEffect } from 'react';
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import './FileOperationsButtons.css';

const FileOperationsButtons = ({
  onUpload,
  onDownloadTemplate,
  onDownloadData,
  acceptedFileTypes = ".xlsx,.xls,.csv",
  uploadTitle = "Upload",
  downloadTitle = "Download Options"
}) => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.download-container')) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="header-buttons">
      <label 
        htmlFor="fileInput" 
        className="icon-button"
        title={uploadTitle}
      >
        <MdFileUpload className="button-icon" />
      </label>
      <input
        id="fileInput"
        type="file"
        accept={acceptedFileTypes}
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            onUpload(selectedFile);
          }
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />
      
      <div className="download-container">
        <button 
          className="icon-button" 
          onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          title={downloadTitle}
        >
          <MdFileDownload className="button-icon" />
        </button>
        {showDownloadOptions && (
          <div className="download-options">
            <button onClick={onDownloadTemplate}>
              Download Template
            </button>
            <button onClick={onDownloadData}>
              Download Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileOperationsButtons; 