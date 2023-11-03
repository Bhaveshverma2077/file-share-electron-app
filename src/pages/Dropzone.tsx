import UploadIcon from "../icons/UploadIcon";
import { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { appContext } from "../main";
import type { File } from "../main";

const Dropzone = () => {
  const { addFile } = useContext(appContext);
  const onDrop = useCallback((files: Array<File>) => {
    // addFile(files);
    console.log("files");
    console.log(files.length);

    files.map((file) => addFile(file));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });
  return (
    <div className="center">
      <h1 className="app-name-heading">Upload Files</h1>
      <div className="app-description"></div>
      <div className="dropzone-dashed">
        <div
          className={`dropzone  relative${isDragActive ? "dropzone-drag" : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <input
            type="file"
            className="input-file"
            onChange={(event) => {
              if (event.target.files != null) {
                console.log(event.target.files[0]);
                addFile(event.target.files[0]);
              }
            }}
          />

          <h4 className="dropzone-text-primary">Drop File Here!</h4>
          <h6 className="dropzone-text-secondary">No Size Limits</h6>
          <div className="icon-container icon-container-50">
            <UploadIcon></UploadIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
