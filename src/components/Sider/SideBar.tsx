import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { OpenDrawer } from "../Header/Header";
import { SideData } from "./SideData";

interface Props {
  Window?: () => Window;
}

export default function SiderBar({ handleCloseDrawer }: any, props: Props) {
  const { window }: any = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fake = useContext(OpenDrawer);
  let openMobile = fake;

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "red",
          maxHeight: 64,
        }}
      >
        <Typography> HELLO ADMIN</Typography>
      </Toolbar>
      <Divider />
      <List disablePadding>
        {SideData.map((value, key) => (
          <Link
            key={key}
            style={{
              textDecoration: "none",
              color: "red",
            }}
            to={value.link}
          >
            <ListItemButton
              selected={selectedIndex === key}
              onClick={(event) => {
                handleListItemClick(event, key);
              }}
            >
              <ListItemIcon>{value.icon}</ListItemIcon>
              <ListItemText primary={value.title} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <Box component="nav" sx={{ width: { sm: 200 } }}>
        <Drawer
          PaperProps={{
            sx: {},
          }}
          container={container}
          variant="temporary"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          open={openMobile}
          onClose={handleCloseDrawer}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 200 },
            background: "#333",
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          PaperProps={{
            sx: {},
          }}
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 200,
            },
            background: "#ff1744",
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}