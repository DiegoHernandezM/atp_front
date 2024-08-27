import React, { useState } from "react";
import { CssBaseline, Box, Paper as MuiPaper, Grid, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import Navigation from "./Navigation";
import GlobalStyle from "../../components/GlobalStyle";
import Navbar from "../../components/navbar/Navbar";


const drawerWidth = 258;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

function App({ children }) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = localStorage.getItem("user");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isLgUp ? 12 : 5} sx={{ width: "100%" }}>
          {children}
          <Outlet />
        </MainContent>
      </AppContent>
      <Navigation />
    </Root>
  );
}

export default App;
