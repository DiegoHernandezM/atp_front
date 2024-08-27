import React from "react";
import styled from "@emotion/styled";
import { Power } from "react-feather";
import { useNavigate } from "react-router-dom";

import {
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const type = localStorage.getItem("usertype");

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  const handleProfile = async () => {
    type === "1" ? navigate("/dashboard/profile") : navigate("/dashboardapp/profile");
  };

  return (
    <React.Fragment>
      <Tooltip title="Sesión">
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Power />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleProfile}>Perfil</MenuItem>
        <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
