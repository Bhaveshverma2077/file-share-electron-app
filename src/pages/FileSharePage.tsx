import UploadIcon from "../icons/UploadIcon";

const FileSharePage = () => {
  return (
    <div className="center">
      <h1 className="app-name-heading">Upload Files</h1>
      <div className="app-description"></div>
      <div className="dropzone-dashed">
        <div className="dropzone">
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

export default FileSharePage;
