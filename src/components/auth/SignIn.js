import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Alert as MuiAlert,
  Button,
  TextField as MuiTextField,
  Typography
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

SignIn.propTypes = {
  token: PropTypes.any,
};

export default function SignIn({ token }) {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/dashboard");
  };

  return (
    <Formik
      initialValues={{
        email: "admin@admin.com",
        password: "secret",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Tiene que ser un coreo valido")
          .max(255)
          .required("El correo es requerido"),
        password: Yup.string().max(255).required("La Contraseña es requerida"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await signIn(values.email, values.password).then(() => {
            handleSignIn();
          });
        } catch (error) {
          const message = error?.data?.message || "Algo salio mal";

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={3} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <Alert variant="outlined" severity="success">
            <Typography variant="subtitle1" gutterBottom>
             Para ingresar como estudiante:
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              correo: student@demo.com
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              contraseña: 123456
            </Typography>
          </Alert>
          <TextField
            type="email"
            name="email"
            label="Correo electronico"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <TextField
            type="password"
            name="password"
            label="Contraseña"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Ingresar
          </Button>
          {/*
           <Button
            component={Link}
            to="/auth/reset-password"
            fullWidth
            color="primary"
            >
              Olvide mi contraseña
            </Button>
          */}
        </form>
      )}
    </Formik>
  );
}
