import { React, useState } from "react";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import {
  Box,
  Drawer,
  Button as MuiButton,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";


const initialState = {
  newPassword: "",
  newPasswordConfirmation: "",
  oldPassword: "",
};

const Button = styled(MuiButton)(spacing);

export default function ChangePassword({ open, close, changePassword }) {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(false);
  const handleChange = (event) => {
    setMessage("");
    setErrors(false);
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (form.newPassword === form.newPasswordConfirmation) {
      changePassword(
        form.oldPassword,
        form.newPassword,
        form.newPasswordConfirmation
      );
    } else {
      setMessage("Las contraseñas no coinciden");
      setErrors(true);
    }
  };

  const clearData = () => {
    setForm(initialState);
    close();
  };

  const handleOnClose = () => {
    close();
  };

  return (
    <Drawer anchor="right" open={open} onClose={clearData}>
      <Box sx={{ width: { xs: "100%", md: "500px", xl: "600px" } }}>
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
            Actualizar Contraseña
          </Typography>
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
        <Box style={{ marginLeft: "10px", marginRight: "10px" }}>
          <TextField
            name="oldPassword"
            required
            autoFocus
            label="Antigua Contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            value={form.oldPassword}
            onChange={handleChange}
            disabled
          />
          <TextField
            name="newPassword"
            required
            label="Nueva Contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            value={form.newPassword}
            onChange={handleChange}
            error={errors}
            helperText={message}
            disabled
          />
          <TextField
            name="newPasswordConfirmation"
            required
            label="Confirmar contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            value={form.newPasswordConfirmation}
            onChange={handleChange}
            error={errors}
            helperText={message}
            disabled
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            mt={4}
            ml={2}
          >
            Cambiar Contraseña
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
