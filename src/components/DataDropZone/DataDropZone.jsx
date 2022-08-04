import "./DataDropZone.css";
import React, { useState } from "react";

export const DataDropZone  = () => {
  const [highlight, setHighlight] = useState(false);

  const getFilesDataTransferItems = (dataTransferItems) => {
    function getFolderData(item, path = "", folder, allFiles) {
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            if (file.name !== ".DS_Store") {
              allFiles.push({ type: "file", name: file.name, file });
            }
            resolve(file);
          });
        } else if (item.isDirectory) {
          let dirReader = item.createReader();

          dirReader.readEntries((entries) => {
            let entriesPromises = [];
            let subfolder = [];
            let allFiles = [];
            folder.push({
              type: "folder",
              name: item.name,
              files: allFiles,
              folders: subfolder,
            });

            for (let entry of entries) {
              entriesPromises.push(
                getFolderData(
                  entry,
                  path || "" + item.name + "/",
                  subfolder,
                  allFiles
                )
              );
            }

            resolve(Promise.all(entriesPromises));
          });
        }
      });
    }

    function getFileData(item, allFiles) {
      return new Promise((resolve) => {
        item.file((file) => {
          if (file.name !== ".DS_Store") {
            allFiles.push({ type: "file", name: file.name, file });
          }
          resolve(file);
        });
        resolve(Promise.all(allFiles));
      });
    }

    let files = [];

    return new Promise((resolve, reject) => {
      let entriesPromises = [];
      for (let it of dataTransferItems) {
        if (it.webkitGetAsEntry().isDirectory) {
          entriesPromises.push(
            getFolderData(it.webkitGetAsEntry(), null, files)
          );
        }
        if (it.webkitGetAsEntry().isFile) {
          entriesPromises.push(getFileData(it.webkitGetAsEntry(), files));
        }
      }

      Promise.all(entriesPromises).then((entries) => {
        resolve(files);
      });
    });
  }

  const onDragOver = (e) => {
    e.preventDefault();
    setHighlight(true);
  }

  const onDragLeave = () => {
      setHighlight(false);
  }

  const onDrop = (e) => {
    e.preventDefault();
    let items = e.dataTransfer.items;
    getFilesDataTransferItems(items).then((files) => {
      console.log("DATA", files);
    });
   setHighlight(false);
  }

    return (
      <div className="container">
        <div className="card">
          <div
            className={`dropZone ${highlight ? "highlight" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <span>Upload files</span>
          </div>
        </div>
      </div>
    );
}


