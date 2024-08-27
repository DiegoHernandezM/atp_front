import React from "react";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { Link } from "react-router-dom";
import {
  AppBar,
  Button as MuiButton,
  Container,
  Grid,
  Box,
  Toolbar
} from "@mui/material";
import PropTypes from "prop-types";
const Button = styled(MuiButton)(spacing);

const Brand = styled.div`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

AppBarComponent.propTypes = {
  content: PropTypes.object
};

export default function AppBarComponent({content})  {
  return (
    <React.Fragment>
      <AppBar position="relative" color="transparent" elevation={4} style={{ backgroundColor:"#203764", color:"white" }}>
        <Toolbar>
          <Container>
            <Grid container alignItems="center">
              <Grid item>
                <Brand>
                  {content.title}
                </Brand>
              </Grid>
              <Grid item xs />
              <Grid item>
                <Box sx={{ display: { xs: "inline-block", md: "inline-block" } }}>
                  <Button
                    ml={2}
                    color="inherit"
                    component={Link}
                    to="/auth/sign-in"
                  >
                    {content.login_link_text}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </React.Fragment>
)}

