/* eslint-disable no-nested-ternary */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
// material
import {
  Box,
  Button,
  Drawer,
  FormControl,
  MenuItem,
  IconButton,
  TextField,
  Typography,
  Divider,
  Card,
  CardActions,
  CardContent
} from "@mui/material";
import { Close } from "@mui/icons-material";
import * as yup from "yup";
import { useFormik } from "formik";
import esLocale from "date-fns/locale/es";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// ----------------------------------------------------------------------

UserForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  user: PropTypes.object,
  update: PropTypes.bool,
  updateUser: PropTypes.func,
  loading: PropTypes.bool,
  resetDevices: PropTypes.func
};

const validationSchema = yup.object({
  name: yup.string("Nombre").required("El nombre es requerido"),
  email: yup
    .string("Email")
    .email("Ingresa una direccion valida")
    .required("El email es requerido"),
});

const TYPE = [
  { id: 0, value: "", label: "SELECCIONE" },
  { id: 1, value: "admin", label: "Administrador" },
  { id: 3, value: "student", label: "Estudiante" },
];

export default function UserForm({
  open,
  close,
  parentCallback,
  user,
  update,
  updateUser,
  loading,
  resetDevices
}) {
  const [hidden, setHidden] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      email: "",
      school: "",
      type_id: 0,
      expires_at: moment().format("YYYY-MM-DD"),
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updateUser(user.id, values);
      }
      resetForm(formik.initialValues);
    },
  });

  useEffect(() => {
    formik.setFieldValue("id", update ? user.id : formik.initialValues.id);
    formik.setFieldValue(
      "name",
      update ? user.name : formik.initialValues.name
    );
    formik.setFieldValue(
      "email",
      update ? user.email : formik.initialValues.email
    );
    formik.setFieldValue(
      "school",
      update ? user.school : formik.initialValues.school
    );
    formik.setFieldValue(
      "type_id",
      update ? user.type_id : formik.initialValues.type_id
    );
    formik.setFieldValue(
      "expires_at",
      update && user.expires_at !== null ? moment(user.expires_at).toDate() :  user?.payments?.length > 0 ? user.payments[0].create_time : formik.initialValues.expires_at
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, user]);

  const handleOnClose = () => {
    close();
  };

  const handleReset = () => {
    console.log(user.id);
    resetDevices(user.id);
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleOnClose}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <Box sx={{ width: { xs: "100%", md: "500px", xl: "600px" } }}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h4"
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  marginBottom: "30px",
                }}
              >
                {update ? "Editar" : "Nuevo usuario"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{
                  borderRadius: 30,
                  height: "30px",
                  marginTop: "20px",
                  marginRight: "10px",
                }}
                size="small"
              >
                {update ? "Actualizar Usuario" : "Guardar"}
              </Button>
              <IconButton
                aria-label="close"
                onClick={handleOnClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  marginBottom: "30px",
                }}
              >
                <Close />
              </IconButton>
            </Box>
            <FormControl
              style={{ marginLeft: "10px", marginTop: "10px", width: "95%" }}
            >
              <TextField
                id="type_id"
                name="type_id"
                label="Tipo de usuario"
                disabled={update}
                onChange={(e, value) => {
                  formik.setFieldValue("type_id", value.props.value);
                  if (value.props.value === 1 || value.props.value === 0) {
                    setHidden(true);
                  } else {
                    setHidden(false);
                  }
                }}
                value={formik.values.type_id || ""}
                error={formik.touched.type_id && Boolean(formik.errors.type_id)}
                helperText={formik.touched.type_id && formik.errors.type_id}
                select
                fullWidth
                size="small"
              >
                {TYPE.map((option) => (
                  <MenuItem key={option.value} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl
              style={{ marginLeft: "10px", marginTop: "10px", width: "95%" }}
            >
              <TextField
                id="name"
                name="name"
                label="Nombre"
                value={formik.values.name || ""}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </FormControl>
            <FormControl
              style={{ marginLeft: "10px", marginTop: "10px", width: "95%" }}
            >
              <TextField
                id="email"
                name="email"
                label="Email"
                value={formik.values.email || ""}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                size="small"
              />
            </FormControl>
            {user.type_id === 1 ? (
              ""
            ) : (
              <div hidden={hidden}>
                <FormControl
                  style={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    width: "95%",
                  }}
                >
                  <TextField
                    id="school"
                    name="school"
                    label="Escuela"
                    value={formik.values.school || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.school && Boolean(formik.errors.school)
                    }
                    fullWidth
                    helperText={formik.touched.school && formik.errors.school}
                    size="small"
                  />
                </FormControl>
                <FormControl
                  style={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    width: "95%",
                  }}
                >
                  <DatePicker
                    label="Expira"
                    minDate={new Date(moment().subtract(1, "days"))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        helperText={
                          formik.touched.expires_at && formik.errors.expires_at
                        }
                        error={
                          formik.touched.expires_at &&
                          Boolean(formik.errors.expires_at)
                        }
                      />
                    )}
                    id="expires_at"
                    name="expires_at"
                    value={
                      new Date(formik.values.expires_at) ||
                      new Date(moment.now())
                    }
                    onChange={(value) => {
                      formik.setFieldValue("expires_at", value);
                    }}
                  />
                </FormControl>
              </div>
            )}
          </form>
          <Divider light style={{ marginTop: "10px" }} />
          <Box sx={{ m: 2 }}>
            <Typography gutterBottom variant="body1">
              DATOS PAYPAL
            </Typography>
            { user?.payments?.length > 0 ? (
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Dirección:
                  </Typography>
                  <Typography variant="body2">
                    { user.payments[0].address }
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Pago:
                  </Typography>
                  <Typography variant="body2">
                  {'$ '}{ user.payments[0].amount }
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Identificador de pago en PAYPAL:
                  </Typography>
                  <Typography variant="body2">
                    { user.payments[0].payment_id }
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    SIN DATOS
                  </Typography>
                </CardContent>
              </Card>
            ) }
          </Box>
          <Box sx={{ m: 2 }}>
            { user?.devices?.length > 0 ? (
              <>
                <Typography gutterBottom variant="h3">
                  DISPOSITIVOS VINCULADOS:  { user.devices.length }
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  style={{
                    borderRadius: 30,
                    height: "30px",
                    marginTop: "20px",
                    marginRight: "10px",
                  }}
                  size="small"
                  onClick={handleReset}
                >
                  Resetear dispositivos
                </Button>
              </>
            ) : (
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                SIN DISPOSITIVOS VINCULADOS
              </Typography>
            ) }
          </Box>
        </Box>
      </LocalizationProvider>
    </Drawer>
  );
}
