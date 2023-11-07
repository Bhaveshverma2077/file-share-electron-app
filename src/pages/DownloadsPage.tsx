import FileTile from "../components/FileTile";
import AddIcon from "../icons/AddIcon";
import { File, appContext } from "../main";
import { useContext, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

const DownloadsPage = () => {
  const { downloadFiles, selectedDevice } = useContext(appContext);
  const { addFile } = useContext(appContext);
  console.log(downloadFiles);

  const onDrop = useCallback((files: Array<File>) => {}, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });
  console.log(downloadFiles);

  const allFiles = Object.entries(downloadFiles).map(
    ([key, files]: [key: string, files: Array<File>]) => {
      return files.map((file) => (
        <FileTile
          ip={key}
          isDownload={true}
          key={`${key}:${file.name}`}
          file={file}
          fileName={file.name}
          fileSizeInKb={file.size / 1000}
          imgUrl={file.imgUrl}
        ></FileTile>
      ));
    }
  );
  console.log(allFiles);

  return (
    <div className="file-container">
      <div className="heading-container">
        <h2> Downloaded Files</h2>{" "}
        {/* <div className="scale-animation relative">
          <input
            className="input-file"
            type="file"
            onChange={(event) => {
              if (event.target.files != null) {
                addFile(event.target.files[0]);
              }
            }}
          />
          <div onClick={open} className="icon-container icon-container-35">
            <AddIcon></AddIcon>
          </div>
        </div> */}
      </div>
      {allFiles}
    </div>
  );
};

export default DownloadsPage;
