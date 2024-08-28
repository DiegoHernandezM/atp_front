import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateUser, changePassword } from "../../../redux/slices/users";
import SnackAlert from "../../components/general/SnackAlert";
import ChangePassword from "./ChangePassword";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

function Public() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState("success");
  const [message, setMessage] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
    formik.setFieldValue("name", user?.name);
    formik.setFieldValue("email", user?.email);
  }, [dispatch, user?.email, user?.name]);

  const validationSchema = yup.object({
    name: yup.string("Nombre").required("El nombre es requerido"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdate(user?.id, values);
    },
  });

  function updateU(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updateUser(id, values)));
      })
        .then((response) => {
          setMessage(
            response.status === 200
              ? "Actualizacion realizada"
              : "Ocurrio algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  const handleUpdate = (id, values) => {
    dispatch(updateU(id, values));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleOpenForm = () => {
    setOpenDrawer(true);
  };

  const handleCloseForm = () => {
    setOpenDrawer(false);
  };

  const handleChangePassword = (
    oldPassword,
    newPassword,
    newPasswordConfirmation
  ) => {
    dispatch(resetPassword(oldPassword, newPassword, newPasswordConfirmation));
  };

  function resetPassword(oldPassword, newPassword, newPasswordConfirmation) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            changePassword(oldPassword, newPassword, newPasswordConfirmation)
          )
        );
      })
        .then((response) => {
          setMessage(
            response.status === 200
              ? "Se cambio la contraseña"
              : response.data.message
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
          setOpenDrawer(false);
        });
  }

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Información personal
        </Typography>
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12} xl={12}>
              <FormControl fullWidth my={2} variant="outlined">
                <TextField
                  id="name"
                  name="name"
                  label="Nombre"
                  variant="outlined"
                  value={formik.values.name ?? ""}
                  onChange={formik.handleChange}
                  fullWidth
                  disabled
                  my={2}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12} xl={12}>
              <FormControl fullWidth my={2} variant="outlined">
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  disabled
                  value={formik.values.email ?? ""}
                  onChange={formik.handleChange}
                  fullWidth
                  disabled
                  my={2}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" color="primary" mt={3}>
            Actualizar
          </Button>
          &nbsp;
          <Button variant="contained" onClick={handleOpenForm} mt={3}>
            Cambiar Contraseña
          </Button>
        </form>
      </CardContent>
      <SnackAlert
        message={message}
        type={typeMessage}
        open={openMessage}
        close={handleCloseMessage}
      />
      <ChangePassword
        open={openDrawer}
        close={handleCloseForm}
        changePassword={handleChangePassword}
      />
    </Card>
  );
}

function Profile() {
  return (
    <React.Fragment>
      <Helmet title="Perfil" />

      <Typography variant="h3" gutterBottom display="inline">
        Perfil
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Public />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Profile;
