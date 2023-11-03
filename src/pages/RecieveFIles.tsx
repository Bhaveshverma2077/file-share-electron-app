import { Switch } from "@mui/material";

const handleRecieveFile = () => {
  window.api.recieveFile();
};

const handleStopRecievingFile = () => {
  window.api.stopRecievingFile();
};

const RecieveFiles = () => {
  return (
    <div className="center">
      <h1>Recieve Files</h1>
      <Switch
        onChange={(event) => {
          if (event.target.checked) {
            handleRecieveFile();
            return;
          }
          handleStopRecievingFile();
        }}
        sx={{
          "&": { height: "100px", width: "150px" },
          "& .MuiSwitch-switchBase": {
            height: "100%",
            transform: "translateX(7px)",
            "&.Mui-checked+.MuiSwitch-track": {
              borderRadius: "50px",
              backgroundColor: "green",
              opacity: 0.67,
            },
            ".MuiSwitch-thumb": {
              height: "70px",
              width: "70px",
              backgroundColor: "#f8f9fa",
            },
            "&.Mui-checked": { transform: "translateX(55px)" },
          },
          "& .MuiSwitch-track": {
            borderRadius: "50px",
            backgroundColor: "red",
            opacity: 0.67,
          },
        }}
      ></Switch>
    </div>
  );
};

export default RecieveFiles;
