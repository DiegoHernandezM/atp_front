import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button as MuiButton, Typography } from "@mui/material";
import { spacing } from "@mui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page404() {
  const type = localStorage.getItem("usertype");

  return (
    <Wrapper>
      <Helmet title="404 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Página no encontrada.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        La página que estas buscando no sencuentra o ha sido removida
      </Typography>

      <Button
        component={Link}
        to={type === "null" ? "/auth/sign-in" : type === "1" ? "/dashboard" : "/dashboardapp"}
        variant="contained"
        color="secondary"
        mt={2}
      >
        REGRESAR
      </Button>
    </Wrapper>
  );
}

export default Page404;
