import FileTile from "../components/FileTile";
import AddIcon from "../icons/AddIcon";
import { File, appContext } from "../main";
import { useContext, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

const Files = () => {
  const { files, selectedDevice } = useContext(appContext);
  const { addFile } = useContext(appContext);

  const onDrop = useCallback((files: Array<File>) => {}, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });
  return (
    <div className="file-container">
      <div className="heading-container">
        <h2> Upload Files</h2>{" "}
        <div className="scale-animation relative">
          <input
            className="input-file"
            type="file"
            onChange={(event) => {
              if (event.target.files != null) {
                console.log(event.target.files[0]);

                addFile(event.target.files[0]);
              }
            }}
          />
          <div onClick={open} className="icon-container icon-container-35">
            <AddIcon></AddIcon>
          </div>
        </div>
      </div>
      {files[selectedDevice!.ip] !== undefined &&
        files[selectedDevice!.ip].map((file) => {
          return (
            <FileTile
              ip={selectedDevice!.ip}
              key={file.path}
              file={file}
              fileName={file.name}
              fileSizeInKb={file.size / 1000}
              imgUrl={file.imgUrl}
            ></FileTile>
          );
        })}
    </div>
  );
};

export default Files;
