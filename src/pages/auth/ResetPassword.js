import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import {Box, Paper, Typography} from "@mui/material";
import ThemedLogo from "../../components/ThemeLogo";
import ResetPasswordComponent from "../../components/auth/ResetPassword";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function ResetPassword() {
  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Reset Password" />
        <Box align="center">
          <ThemedLogo alt="logo" align="center"/>
        </Box>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Resetear Contraseña
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Ingresa tu correo para resetear tu contraseña
        </Typography>

        <ResetPasswordComponent />
      </Wrapper>
    </React.Fragment>
  );
}

export default ResetPassword;
