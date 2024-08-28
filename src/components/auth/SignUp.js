import React, { useState } from "react";
import PropTypes from "prop-types";
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

SignUp.propTypes ={
  handleCallBack: PropTypes.func,
  handleChangeEmail: PropTypes.func
}

export default function SignUp({ handleCallBack, handleChangeEmail }) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  return (
    <Formik
      initialValues={{
        name: "",
        school: "",
        email: "",
        password: "",
        submit: false,
        type: 3
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required("El nombre es requerido"),
        email: Yup.string()
          .email("El correo tiene que ser valido")
          .max(255)
          .required("El correo es requerido"),
        school: Yup.string().max(255).required("La escuela es requerida"),
        password: Yup.string()
          .min(8, "La contraseña debe ser mayor a 8 caracteres")
          .max(255)
          .required("La contraseña es requerida"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
        try {
          handleCallBack(values);
          resetForm();
        } catch (error) {
          const message = error.message || "Algo salio mal";

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
            disabled
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={(e) => {
              handleBlur(e);
              handleChangeEmail(e);
            }}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="name"
            disabled
            label="Nombre Completo"
            value={values.name}
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="school"
            label="Escuela de procedencia"
            value={values.school}
            error={Boolean(touched.school && errors.school)}
            fullWidth
            helperText={touched.school && errors.school}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
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
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Guardar
          </Button>
        </form>
      )}
    </Formik>
  );
}
