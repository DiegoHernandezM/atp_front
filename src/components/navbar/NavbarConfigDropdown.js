import React from "react";
import { css } from "@emotion/react";
import { green, grey, indigo } from "@mui/material/colors";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Settings as SettingsIcon } from "react-feather";
import Settings from "../Settings";
import { THEMES } from "../../constants";
import useTheme from "../../hooks/useTheme";

import {
  Tooltip,
  Menu,
  MenuItem,
  ListItemButton,
  Box,
  Grid,
  Typography,
  IconButton as MuiIconButton,
} from "@mui/material";

function Demo({ title, themeVariant }) {
    const { theme, setTheme } = useTheme();
  
    return (
      <Grid item xs={6}>
        <DemoButton
          active={themeVariant === theme}
          onClick={() => setTheme(themeVariant)}
        >
          <DemoButtonInner selectedTheme={themeVariant} />
        </DemoButton>
        <DemoTitle variant="subtitle2" gutterBottom>
          {title}
        </DemoTitle>
      </Grid>
    );
  }

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;
const Wrapper = styled.div`
  width: 258px;
  overflow-x: hidden;
`;
const Heading = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;
const DemoButton = styled.div`
  cursor: pointer;
  background: ${(props) => props.theme.palette.background.paper};
  height: 80px;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.825rem;
  position: relative;
  border: 1px solid
    ${(props) =>
      !props.active
        ? props.theme.palette.action.selected
        : props.theme.palette.action.active};
`;
const DemoButtonInner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${(props) => props.theme.palette.action.selected};
  position: relative;

  ${(props) =>
    props.selectedTheme === THEMES.DEFAULT &&
    css`
      background: linear-gradient(-45deg, #23303f 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.DARK &&
    css`
      background: #23303f;
    `}
  ${(props) =>
    props.selectedTheme === THEMES.LIGHT &&
    css`
      background: ${grey[100]};
    `}
  ${(props) =>
    props.selectedTheme === THEMES.BLUE &&
    css`
      background: linear-gradient(-45deg, #4782da 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.GREEN &&
    css`
      background: linear-gradient(-45deg, ${green[500]} 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.INDIGO &&
    css`
      background: linear-gradient(-45deg, ${indigo[500]} 50%, ${grey[100]} 0);
    `}
`;
const DemoTitle = styled(Typography)`
  text-align: center;
`;

function NavbarLanguagesDropdown() {
  const { i18n } = useTranslation();
  const [anchorMenu, setAnchorMenu] = React.useState(null);

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };


  return (
    <React.Fragment>
      <Tooltip title="Configuración">
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <Wrapper>
          <Heading>Modo</Heading>

          <Box px={4} my={3}>
            <Grid container spacing={3}>
              <Demo title="Dark" themeVariant={THEMES.DARK} />
              <Demo title="Light" themeVariant={THEMES.DEFAULT} />
            </Grid>
          </Box>

        </Wrapper>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarLanguagesDropdown;
