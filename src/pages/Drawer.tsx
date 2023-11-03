import { Button, Collapse, Divider } from "@mui/material";
import MenuItem from "./MenuItem";
import ChevronDown from "../icons/ChevronDown";
import AllDevices from "./AllDevices";
import { useContext, useState } from "react";
import { appContext } from "../main";
import ChevronTop from "../icons/ChevronTop";

const Drawer = () => {
  const { findDevices, setPage } = useContext(appContext);
  const [isDeviceDropDownOpen, toggleDeviceDropDownOpen] = useState(false);
  return (
    <div className="drawer">
      <Button
        onClick={findDevices}
        sx={{ marginLeft: "8px" }}
        variant="contained"
      >
        Find Devices
      </Button>
      <MenuItem
        title="Recieve Files"
        callback={() => {
          setPage("RecieveFiles");
        }}
      ></MenuItem>
      <MenuItem
        title="Downloads"
        callback={() => {
          setPage("Download");
        }}
      ></MenuItem>
      <MenuItem
        callback={() => {
          toggleDeviceDropDownOpen((value) => !value);
        }}
        title="Devices"
        icon={
          isDeviceDropDownOpen ? (
            <ChevronTop></ChevronTop>
          ) : (
            <ChevronDown></ChevronDown>
          )
        }
      ></MenuItem>
      <Divider color="grey"></Divider>
      <Collapse in={isDeviceDropDownOpen}>
        <div className="devices-container">
          <AllDevices></AllDevices>
        </div>
      </Collapse>
    </div>
  );
};

export default Drawer;
