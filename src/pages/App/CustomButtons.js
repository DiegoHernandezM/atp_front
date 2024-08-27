import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle, Replay, Home } from '@mui/icons-material';
import './PaperPlaneAnimation.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

CustomButtons.propTypes = {
  reset: PropTypes.any,
  close: PropTypes.any
};

function CustomButtons({ reset, close }) {
  const navigate = useNavigate();
  return (
    <Box style={{ marginTop: "20px" }}>
      <Box display="flex" justifyContent="center" alignItems="center" style={{ marginTop: "30px" }}>
        <Typography variant="h4" component="span">¿Qué deseas hacer?</Typography>
      </Box>

      <Box
        className="button-container"
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "20px" }}
      >
        <Box className="triangle-layout">
          <Button className="custom-button button-top" onClick={close}>
            <CheckCircle sx={{ fontSize: 40 }} />
            <span>Revisar</span>
          </Button>
          <Button className="custom-button button-left" onClick={reset}>
            <Replay sx={{ fontSize: 40 }} />
            <span>Reintentar</span>
          </Button>
          <Button className="custom-button button-right" onClick={() => navigate("/dashboardapp")}>
            <Home sx={{ fontSize: 40 }} />
            <span>Inicio</span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CustomButtons;
