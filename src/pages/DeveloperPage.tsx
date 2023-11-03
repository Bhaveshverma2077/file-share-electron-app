import { LinearProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const DeveloperPage = () => {
  const [ip, setIp] = useState("");
  const [progress, setProgress] = useState(0);
  const [filePath, setFilePath] = useState("");
  useEffect(() => {
    window.api.onProgress((progress: number) => {
      setProgress(progress);
    });
  }, []);
  return (
    <div style={{ backgroundColor: "grey" }}>
      <h1>Welcome</h1>
      <TextField
        color="primary"
        label="IP"
        sx={{ input: { color: "white" } }}
        value={ip}
        onChange={(e) => {
          setIp(e.target.value);
        }}
        inputProps={{ style: { color: "white" } }}
        type="text"
      />
      <TextField
        sx={{ input: { color: "white" } }}
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files != null) setFilePath(e.target.files[0].path);
        }}
        name="file"
      />
      <LinearProgress
        variant={"determinate"}
        value={progress ?? 0}
      ></LinearProgress>
      <div>
        <button
          onClick={() => filePath != null && window.api.sendFile(ip, filePath)}
        >
          Send File
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            window.api.stopRecievingFile();
          }}
        >
          Stop Recieving File
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            window.api.recieveFile();
          }}
        >
          Recieve File
        </button>
      </div>{" "}
    </div>
  );
};
export default DeveloperPage;
