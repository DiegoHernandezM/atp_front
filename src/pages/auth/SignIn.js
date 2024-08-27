import React from "react";
import { useParams, Link } from 'react-router-dom';
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Paper, Typography, Box } from "@mui/material";

import SignInComponent from "../../components/auth/SignIn";
import ThemedLogo from "../../components/ThemeLogo";
const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;


const ForgotPasswordLink = styled(Link)`
  display: block;
  margin-top: ${(props) => props.theme.spacing(3)};
  text-align: center;
  color: ${(props) => props.theme.palette.primary.main};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function SignIn() {
  const { token } = useParams();
  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Iniciar sesión" />
        <Box align="center">
          <ThemedLogo alt="logo" align="center"/>
        </Box>

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Bienvenido de vuelta!
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Ingresa tus credenciales
        </Typography>

        <SignInComponent token={token}/>

        <ForgotPasswordLink to="/auth/reset-password">
          Olvidé mi contraseña
        </ForgotPasswordLink>
      </Wrapper>
    </React.Fragment>
  );
}

export default SignIn;
