import { Card, LinearProgress } from "@mui/material";
import UploadIcon from "../icons/UploadIcon";
import CloseIcon from "../icons/CloseIcon";
import FileIcon from "../icons/FileIcon";
import { useContext, useEffect, useState } from "react";
import { File, appContext } from "../main";
import FolderIcon from "../icons/FolderIcon";

const getFileSize = (fileSizeInKb: number) => {
  if (fileSizeInKb > 1048575) {
    return `${(fileSizeInKb / (1024 * 1024)).toFixed(2)} GB`;
  }
  if (fileSizeInKb > 1023) {
    return `${(fileSizeInKb / 1024).toFixed(2)} MB`;
  }
  return `${fileSizeInKb.toFixed(2)} KB`;
};

const handleSendFile = (ip: string, filePath: string) => {
  window.api.sendFile(ip, filePath);
};

const FileTile = (props: {
  file: File;
  imgUrl?: string;
  ip: string;
  fileName: string;
  fileSizeInKb: number;
}) => {
  const [progress, setProgress] = useState<null | number>(0);
  const [speed, setSpeed] = useState<number>(0);
  useEffect(() => {
    window.api.onProgress((progress: number) => {
      setProgress(progress);
    });

    window.api.onSpeed(
      (speedData: { speed: number; ip: string; filePath: string }) => {
        if (props.file.path === speedData.filePath && props.ip === speedData.ip)
          setSpeed(speedData.speed);
      }
    );
  }, []);
  const { selectedDevice, removeFile } = useContext(appContext);

  return (
    <div className="card-wrapper">
      <Card
        sx={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
        }}
      >
        <div className="file-tile">
          <div className="file-img-container">
            {props.imgUrl != null ? (
              <img className="file-img" src={props.imgUrl}></img>
            ) : (
              // <div className="icon-container icon-container-35">
              <div className="file-tile-file-icon center">
                <FileIcon></FileIcon>
              </div>
              // </div>
            )}
          </div>
          <div className="file-tile-content">
            <h5>{props.fileName}</h5>
            <div className="file-size-speed-container">
              <h6>{getFileSize(props.fileSizeInKb)}</h6>
              <h6>{`${(speed / (1024 * 1024)).toFixed(2)} mbps`}</h6>
            </div>
            {progress != null && progress < 100 && (
              <LinearProgress
                variant="determinate"
                value={progress ?? 0}
              ></LinearProgress>
            )}
          </div>
          {progress != null && progress < 100 && (
            <>
              <div className="file-icon-wrapper scale-animation margin-left-12 margin-right-12">
                <div
                  onClick={() => {
                    removeFile(props.file);
                  }}
                  className="icon-container icon-container-35"
                >
                  <CloseIcon></CloseIcon>
                </div>
              </div>
              <div className="file-icon-wrapper scale-animation margin-right-12">
                <div
                  onClick={() => {
                    handleSendFile(selectedDevice!.ip, props.file.path);
                  }}
                  className="icon-container icon-container-35"
                >
                  <UploadIcon></UploadIcon>
                </div>
              </div>
            </>
          )}
          {progress != null && progress === 100 && (
            <div className="file-icon-wrapper scale-animation margin-right-12">
              <div
                onClick={() => {
                  handleSendFile(selectedDevice!.ip, props.file.path);
                }}
                className="icon-container icon-container-35"
              >
                <FolderIcon></FolderIcon>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FileTile;
