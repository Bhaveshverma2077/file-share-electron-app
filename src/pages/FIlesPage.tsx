import { appContext } from "../main";
import Dropzone from "./Dropzone";
import { useCallback, useContext } from "react";
import Files from "./Files";

const FilesPage = () => {
  const { selectedDevice, files } = useContext(appContext);
  return (
    <>
      {selectedDevice != null &&
        (files[selectedDevice.ip] == null ||
          files[selectedDevice.ip].length == 0) && <Dropzone></Dropzone>}
      {selectedDevice != null &&
        files[selectedDevice.ip] != null &&
        files[selectedDevice.ip].length != 0 && <Files></Files>}
    </>
  );
};

export default FilesPage;
