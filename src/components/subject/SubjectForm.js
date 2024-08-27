import { useEffect, useState } from "react";
import PropTypes from "prop-types";
// material
import {
  Box,
  Button,
  Drawer,
  FormControl,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import * as yup from "yup";
import { useFormik } from "formik";
import SnackAlert from "../../../src/pages/components/general/SnackAlert";

// ----------------------------------------------------------------------

SubjectForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  subject: PropTypes.object,
  update: PropTypes.bool,
  updateRegister: PropTypes.func,
};

export default function SubjectForm({
  open,
  close,
  parentCallback,
  subject,
  update,
  updateRegister,
}) {
  const [image, setImage] = useState(null);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState("success");
  const [message, setMessage] = useState("");
  const validationSchema = yup.object({
    name: yup.string("Nombre").required("El nombre es requerido"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      questions_to_test: "0",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        if (image !== null) {
          parentCallback(values, image);
          resetForm(formik.initialValues);
        } else {
          setMessage("Debe agregar una imagen");
          setTypeMessage("error");
          setOpenMessage(true);
        }
      } else {
        updateRegister(values, image ?? null);
        resetForm(formik.initialValues);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue(
      "name",
      update ? subject.name : formik.initialValues.name
    );
    formik.setFieldValue(
      "questions_to_test",
      update ? subject.questions_to_test : formik.initialValues.questions_to_test
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, subject]);

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box
        sx={{
          width: { xs: "100%", md: "500px", xl: "600px" },
          padding: "10px",
        }}
      >
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
              style={{ marginTop: "10px", marginBottom: "30px" }}
            >
              {update ? "Actualizar" : "Nuevo"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{
                borderRadius: 30,
                height: "30px",
                marginTop: "10px",
                marginLeft: "10px",
                marginBottom: "30px",
              }}
              size="small"
            >
              {update ? "Actualizar" : "Guardar"}
            </Button>
            <IconButton
              aria-label="close"
              onClick={close}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
              style={{ marginTop: "10px", marginBottom: "30px" }}
            >
              <Close />
            </IconButton>
          </Box>
          <FormControl style={{ marginTop: "8px", width: "100%" }}>
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
          <FormControl style={{ marginTop: "8px", width: "100%" }}>
            <TextField
              id="questions_to_test"
              label="Número de preguntas para simulacro"
              placeholder="Número de preguntas para simulacro"              
              name="questions_to_test"
              value={formik.values.questions_to_test || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.questions_to_test && Boolean(formik.errors.questions_to_test)
              }
              fullWidth
              size="small"
            />
          </FormControl>
          <FormControl style={{ marginTop: "8px", width: "100%" }}>
            <TextField
              id="image"
              type="file"
              name="imagen"
              accepts="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              fullWidth
            />
          </FormControl>
        </form>
      </Box>
      <SnackAlert
        message={message}
        type={typeMessage}
        open={openMessage}
        close={handleCloseMessage}
      />
    </Drawer>
  );
}
