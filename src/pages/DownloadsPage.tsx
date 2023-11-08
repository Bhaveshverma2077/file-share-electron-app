import FileTile from "../components/FileTile";
import AddIcon from "../icons/AddIcon";
import { File, appContext } from "../main";
import { useContext } from "react";

const DownloadsPage = () => {
  const { downloadFiles } = useContext(appContext);

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
        <h2> Downloaded Files</h2>
      </div>
      {allFiles}
    </div>
  );
};

export default DownloadsPage;
