import { useContext, useState } from "react";
import Device from "./Device";
import { appContext } from "../main";
import { Skeleton } from "@mui/material";

const AllDevies = () => {
  const { allDevices, isDevicesLoading, changeSelectedDevice, selectedDevice } =
    useContext(appContext);
  const devices = allDevices.map((deviceInfo) => (
    <Device
      callback={() => {
        changeSelectedDevice(deviceInfo);
      }}
      key={deviceInfo.addresses[0]}
      ip={deviceInfo.addresses[0]}
      active={deviceInfo.addresses[0] === selectedDevice?.addresses[0]}
    ></Device>
  ));
  if (isDevicesLoading) {
    const skeletons = ["", "", "", "", ""].map(() => (
      <Skeleton
        sx={{
          backgroundColor: "rgba(255,255,255,0.05)",
          margin: "auto 8px 8px 8px",
        }}
        animation="pulse"
        variant="rounded"
        height={46}
      ></Skeleton>
    ));
    return <>{skeletons}</>;
  }

  if (devices.length == 0)
    return <h6 className="device-unavailable-text">No Devices available</h6>;
  return <>{devices}</>;
};

export default AllDevies;
