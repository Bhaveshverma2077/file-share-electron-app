import { Card, LinearProgress } from "@mui/material";
import UploadIcon from "../icons/UploadIcon";
import CloseIcon from "../icons/CloseIcon";

const getFileSize = (fileSizeInKb: number) => {
  if (fileSizeInKb > 1048575) {
    return `${(fileSizeInKb / (1024 * 1024)).toFixed(2)} GB`;
  }
  if (fileSizeInKb > 1023) {
    return `${(fileSizeInKb / 1024).toFixed(2)} MB`;
  }
  return `${fileSizeInKb.toFixed(2)} KB`;
};

const FileTile = (props: {
  imgUrl: string;
  fileName: string;
  fileSizeInKb: number;
}) => {
  return (
    <div className="card-wrapper">
      <Card
        sx={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
        }}
      >
        <div className="file-tile">
          <div className="file-img-container">
            <img className="file-img" src={props.imgUrl}></img>
          </div>
          <div className="file-tile-content">
            <h5>{props.fileName}</h5>
            <h6>{getFileSize(props.fileSizeInKb)}</h6>
            <LinearProgress></LinearProgress>
          </div>
          <div className="file-icon-wrapper  scale-animation margin-left-12 margin-right-12">
            <div className="icon-container icon-container-35">
              <CloseIcon></CloseIcon>
            </div>
          </div>
          <div className="file-icon-wrapper scale-animation margin-right-12">
            <div className="icon-container icon-container-35">
              <UploadIcon></UploadIcon>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileTile;
