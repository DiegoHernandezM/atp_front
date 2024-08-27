import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Alert as MuiAlert,
  Button,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSignIn = () => {
    navigate("/auth/sign-in");
  };

  return (
    <Formik
      initialValues={{
        email: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Ingresa un correo valido")
          .max(255)
          .required("El correo es requerido"),
      })}

      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await resetPassword(values.email).then(() => {
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
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label="Correo"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Solicitar nueva contraseña
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default ResetPassword;
