import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PhoneIcon from "../icons/PhoneIcon";

const Device = (props: {
  ip: string;
  active: boolean;
  callback: () => void;
}) => {
  return (
    <ListItemButton
      onClick={props.callback}
      sx={{
        backgroundColor: props.active ? "#583DA1" : "transparent",
        borderRadius: "4px",
        margin: "8px",
        ":hover": { backgroundColor: "#583DA1" },
      }}
    >
      <ListItemIcon>
        <div className="indicator-wrapper">
          <div className="indicator indicator-red"></div>
        </div>
        <PhoneIcon></PhoneIcon>
      </ListItemIcon>
      <ListItemText primary={props.ip} sx={{ color: "#f8f9fa" }}></ListItemText>
    </ListItemButton>
  );
};

export default Device;
