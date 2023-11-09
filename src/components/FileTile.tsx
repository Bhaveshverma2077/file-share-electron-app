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
  isDownload?: boolean;
  ip: string;
  fileName: string;
  fileSizeInKb: number;
}) => {
  const [progress, setProgress] = useState<null | number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const {
    selectedDevice,
    removeFile,
    setFileCompleted,
    setFileFailed,
    removeDownloadFile,
  } = useContext(appContext);
  useEffect(() => {
    if (props.isDownload) {
      window.api.onDownloadProgress(
        ({
          progress,
          ip,
          fileName,
        }: {
          progress: number;
          ip: string;
          fileName: string;
        }) => {
          if (props.ip === ip && fileName === props.fileName) {
            setProgress(progress);
          }
        }
      );

      window.api.onDownloadSpeed(
        (speedData: { speed: number; ip: string; fileName: string }) => {
          if (
            props.fileName === speedData.fileName &&
            props.ip === speedData.ip
          )
            setSpeed(speedData.speed);
        }
      );
      return;
    }
    window.api.onProgress(
      ({
        progress,
        ip,
        fileName,
      }: {
        progress: number;
        ip: string;
        fileName: string;
      }) => {
        if (props.ip === ip && fileName === props.fileName) {
          setProgress(progress);
        }
      }
    );

    window.api.onSpeed(
      (speedData: { speed: number; ip: string; filePath: string }) => {
        if (props.file.path === speedData.filePath && props.ip === speedData.ip)
          setSpeed(speedData.speed);
      }
    );
    window.api.onSendCompleted(
      ({ ip, fileName }: { ip: string; fileName: string }) => {
        setFileCompleted(false, ip, fileName);
      }
    );
  }, []);

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
              {progress != null && progress < 100 && progress > 0 && (
                <h6>{`${(speed / (1024 * 1024)).toFixed(2)} mbps`}</h6>
              )}
            </div>
            {progress != null && progress < 100 && progress > 0 && (
              <LinearProgress
                variant="determinate"
                value={progress ?? 0}
              ></LinearProgress>
            )}
          </div>
          {props.file.failed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "24px",
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 700 }}>Canceled</p>
            </div>
          )}
          {!props.file.completed &&
            !props.file.failed &&
            progress != null &&
            progress < 100 && (
              <>
                <div className="file-icon-wrapper scale-animation margin-left-12 margin-right-12">
                  <div
                    onClick={() => {
                      if (props.isDownload) {
                        removeFile(props.file);
                        window.api.sendDownloadCancel({
                          ip: props.ip,
                          fileName: props.fileName,
                        });
                        setTimeout(() => {
                          setProgress(null);
                          setFileFailed(true, props.ip, props.fileName);
                        }, 2000);
                        return;
                      }

                      removeDownloadFile(props.file, props.ip);
                      setTimeout(() => {
                        setProgress(null);
                        setFileFailed(false, props.ip, props.fileName);
                      }, 2000);
                      window.api.sendUploadCancel({
                        ip: props.ip,
                        fileName: props.fileName,
                      });
                    }}
                    className="icon-container icon-container-35"
                  >
                    <CloseIcon></CloseIcon>
                  </div>
                </div>
                {!props.isDownload &&
                  !props.file.completed &&
                  progress != null &&
                  progress === 0 && (
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
                  )}
              </>
            )}
          {props.isDownload && !props.file.failed && props.file.completed && (
            <div
              className={`file-icon-wrapper scale-animation margin-left-12 margin-right-12
              `}
            >
              <div
                onClick={() => {}}
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
