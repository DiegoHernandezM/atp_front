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
import { getContent, updateContent } from "../../../redux/slices/landing";
import SnackAlert from "../../components/general/SnackAlert";
import Preview from "./Preview";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

function AdminPanel() {
  const dispatch = useDispatch();
  const { content } = useSelector((state) => state.content);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState("success");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getContent());
    formik.setFieldValue("title", content?.title);
    formik.setFieldValue("subtitle", content?.subtitle);
    formik.setFieldValue("principal_text", content?.principal_text);
    formik.setFieldValue("compatible_text", content?.compatible_text);
    formik.setFieldValue("footer_title", content?.footer_title);
    formik.setFieldValue("footer_text_1", content?.footer_text_1);
    formik.setFieldValue("footer_text_2", content?.footer_text_2);
    formik.setFieldValue("footer_text_3", content?.footer_text_3);
    formik.setFieldValue("footer_text_4", content?.footer_text_4);
    formik.setFieldValue("link_video", content?.link_video);
    formik.setFieldValue("subscribe_button", content?.subscribe_button);
    formik.setFieldValue("login_link_text", content?.login_link_text);
    formik.setFieldValue("ws_number", content?.ws_number);
  }, [dispatch, content?.title]);

  const validationSchema = yup.object({
    title: yup.string("Titulo").required("El titulo es requerido"),
    subtitle: yup.string("Subtitulo").required("El subtitulo es requerido"),
    principal_text: yup.string("Texto Principal").required("El texto principal es requerido"),
    compatible_text: yup.string("Compatible").required("El texto de compatibilidad es requerido"),
    footer_title: yup.string("Titulo inferior").required("El titulo inferior es requerido"),
    footer_text_1: yup.string("Texto inferiror 1").required("El texto inferiror 1 es requerido"),
    footer_text_2: yup.string("Texto inferiror 2").required("El texto inferiror 2 es requerido"),
    footer_text_3: yup.string("Texto inferiror 3").required("El texto inferiror 3 es requerido"),
    footer_text_4: yup.string("Texto inferiror 4").required("El texto inferiror 4 es requerido"),
    link_video: yup.string("Link de video").required("El link de video es requerido"),
    subscribe_button: yup.string("Boton de suscribirse").required("El boton de suscribirse es requerido"),
    login_link_text: yup.string("Boton de login").required("El boton de login es requerido"),
    ws_number: yup.string("Numero de telefono").required("El numero de telefono es requerido")
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      principal_text: "",
      compatible_text: "",
      footer_title: "",
      footer_text_1: "",
      footer_text_2: "",
      footer_text_3: "",
      footer_text_4: "",
      link_video: "",
      subscribe_button: "",
      login_link_text: "",
      ws_number: ""
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  function updateC(values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updateContent(values)));
      })
        .then((response) => {
          setMessage(
            response.status === 200
              ? "Actualizacion realizada"
              : "Ocurrio algun error"
          );
          setTypeMessage(response.status === 200 ? "success" : "error");
          setOpenMessage(true);
          dispatch(getContent());
        })
        .catch((error) => {
          console.log(error);
        });
  }
  const handleUpdate = (values) => {
    dispatch(updateC(values));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  return (
    <React.Fragment>
      <Helmet title="Administración de Landing" />
      <Typography variant="h3" gutterBottom display="inline">
        Administración de Landing
      </Typography>
      <Divider my={6} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card mb={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información principal
              </Typography>
              <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="title"
                        name="title"
                        label="Titulo pricnipal"
                        variant="outlined"
                        value={formik.values.title || ""}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        onChange={formik.handleChange}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="subtitle"
                        name="subtitle"
                        label="Subtitulo"
                        variant="outlined"
                        value={formik.values.subtitle || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
                        helperText={formik.touched.subtitle && formik.errors.subtitle}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="principal_text"
                        name="principal_text"
                        label="Texto principal"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={formik.values.principal_text || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.principal_text && Boolean(formik.errors.principal_text)}
                        helperText={formik.touched.principal_text && formik.errors.principal_text}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="compatible_text"
                        name="compatible_text"
                        label="Texto de compatibilidad"
                        variant="outlined"
                        value={formik.values.compatible_text || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.compatible_text && Boolean(formik.errors.compatible_text)}
                        helperText={formik.touched.compatible_text && formik.errors.compatible_text}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom>
                  Información inferior
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="footer_title"
                        name="footer_title"
                        label="Titulo inferior"
                        variant="outlined"
                        value={formik.values.footer_title || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.footer_title && Boolean(formik.errors.footer_title)}
                        helperText={formik.touched.footer_title && formik.errors.footer_title}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="footer_text_1"
                        name="footer_text_1"
                        label="Texto inferior 1"
                        variant="outlined"
                        value={formik.values.footer_text_1 || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.footer_text_1 && Boolean(formik.errors.footer_text_1)}
                        helperText={formik.touched.footer_text_1 && formik.errors.footer_text_1}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="footer_text_2"
                        name="footer_text_2"
                        label="Texto inferior 2"
                        variant="outlined"
                        value={formik.values.footer_text_2 || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.footer_text_2 && Boolean(formik.errors.footer_text_2)}
                        helperText={formik.touched.footer_text_2 && formik.errors.footer_text_2}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="footer_text_3"
                        name="footer_text_3"
                        label="Texto inferior 3"
                        variant="outlined"
                        value={formik.values.footer_text_3 || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.footer_text_3 && Boolean(formik.errors.footer_text_3)}
                        helperText={formik.touched.footer_text_3 && formik.errors.footer_text_3}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="footer_text_4"
                        name="footer_text_4"
                        label="Texto inferior 4"
                        variant="outlined"
                        value={formik.values.footer_text_4 || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.footer_text_4 && Boolean(formik.errors.footer_text_4)}
                        helperText={formik.touched.footer_text_4 && formik.errors.footer_text_4}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom>
                  Link a video y botones
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="link_video"
                        name="link_video"
                        label="Link de video"
                        variant="outlined"
                        value={formik.values.link_video || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.link_video && Boolean(formik.errors.link_video)}
                        helperText={formik.touched.link_video && formik.errors.link_video}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="subscribe_button"
                        name="subscribe_button"
                        label="Texto de boton suscribir"
                        variant="outlined"
                        value={formik.values.subscribe_button || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.subscribe_button && Boolean(formik.errors.subscribe_button)}
                        helperText={formik.touched.subscribe_button && formik.errors.subscribe_button}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="login_link_text"
                        name="login_link_text"
                        label="Texto de boton login"
                        variant="outlined"
                        value={formik.values.login_link_text || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.login_link_text && Boolean(formik.errors.login_link_text)}
                        helperText={formik.touched.login_link_text && formik.errors.login_link_text}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth my={2} variant="outlined">
                      <TextField
                        id="ws_number"
                        name="ws_number"
                        label="Numero de Whatsapp"
                        variant="outlined"
                        value={formik.values.ws_number || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.ws_number && Boolean(formik.errors.ws_number)}
                        helperText={formik.touched.ws_number && formik.errors.ws_number}
                        fullWidth
                        my={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Button variant="contained" type="submit" color="primary" mt={3}>
                  Guardar
                </Button>
              </form>
            </CardContent>
            <SnackAlert
              message={message}
              type={typeMessage}
              open={openMessage}
              close={handleCloseMessage}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card mb={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visualización
              </Typography>
              <Preview content={formik.values} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AdminPanel;
