import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "./PaperPlaneAnimation.css";

function PaperPlaneAnimation({ grade, points, color }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 100); // Inicia el contenido un segundo después de que el avión comience
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <div className={`message ${showMessage ? "visible" : ""}`}>
        {showMessage && (grade * 100) / points > 80 ? (
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            color={color}
          >
            Excelente trabajo capitán
          </Typography>
        ) : showMessage && (grade * 100) / points > 70 ? (
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            color={color}
          >
            Sigue practicando para emprender el vuelo. Estas cerca del éxito
          </Typography>
        ) : showMessage && (grade * 100) / points < 70 ? (
          <>
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
              color={color}
            >
              Hay que reforzar conceptos, aún estás a tiempo. Ánimo capitán
            </Typography>
          </>
        ) : null}
      </div>
      <div className={`captain-container ${showMessage ? "visible" : ""}`}>
        {showMessage && (grade * 100) / points > 80 ? (
          <img
            src="/static/img/avatars/capitan-good.png"
            alt="captain"
            className="captain-image"
          />
        ) : showMessage && (grade * 100) / points > 70 ? (
          <img
            src="/static/img/avatars/capitan-mid.png"
            alt="captain"
            className="captain-image"
          />
        ) : showMessage && (grade * 100) / points < 70 ? (
          <img
            src="/static/img/avatars/capitan-bad.png"
            alt="captain"
            className="captain-image"
          />
        ) : null}
      </div>
    </div>
  );
}

export default PaperPlaneAnimation;
