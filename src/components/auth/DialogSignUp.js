import * as React from 'react';
import PropTypes from "prop-types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

DialogSignUp.propTypes ={
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleAgree: PropTypes.func
}

export default function DialogSignUp({ open, handleClose, handleAgree }) {
  
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Correo ya registrado"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            El correo proporcionado ya cuenta con registro en el sistema, realiza tu pago para poder acceder
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAgree} autoFocus>
            Completar Pago
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}