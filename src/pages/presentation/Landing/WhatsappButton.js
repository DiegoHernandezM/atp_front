import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'darkgreen'
    }
  }
}));

const WhatsappButton = () => {
  const classes = useStyles();
  const phoneNumber = '5616951067';
  const message = 'Hola, ¿cómo estás?';
  const handleWhatsappClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
      <Fab color="primary" aria-label="whatsapp" onClick={handleWhatsappClick} className={classes.button}>
        <Tooltip title="Contactanos">
          <WhatsAppIcon />
        </Tooltip>
      </Fab>
    </div>
  );
};

export default WhatsappButton;