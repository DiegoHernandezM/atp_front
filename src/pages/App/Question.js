import React, { useState, useEffect, useRef } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { Typography, Box } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import confetti from 'canvas-confetti';
import "./styles.css";

const Question = ({
  question,
  value,
  showAnswer,
  disabled,
  handleChange,
  rightAnswer,
}) => {
  const [message, setMessage] = useState('');
  const [hiddenBox, setHiddenBox] = useState(false);
  const [shake, setShake] = useState(false);
  const canvasRef = useRef(null);
  const correctButtonRef = useRef(null);

  useEffect(() => {
    if (value !== '') {
      setHiddenBox(true);
      setShake(true);
      if (value === question.answer) {
        setMessage("Respuesta correcta");
        if (correctButtonRef.current) {
          const rect = correctButtonRef.current.getBoundingClientRect();
          const confettiSettings = {
            particleCount: window.innerWidth < 768 ? 50 : 100,
            spread: window.innerWidth < 768 ? 70 : 160,
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight
            },
            angle: 90,
            startVelocity: 30,
          };
          const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true,
          });
          myConfetti(confettiSettings);
        }
      } else {
        setMessage("Respuesta incorrecta");
      }
      setTimeout(() => {
        setShake(false);
      }, 10000);
    } else {
      setHiddenBox(false);
      setMessage('');
      setShake(false);
    }
  }, [value, question.answer]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
      <FormControl
        error={value !== question.answer && showAnswer === 1}
        fullWidth
        sx={{ marginTop: "25px" }}
      >
        <FormLabel
          id="demo-row-radio-buttons-group-label"
          sx={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "40px", marginTop: "20px" }}
        >
          {question.question}
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-row-radio-buttons-group-label"
          name={`${question.id}`}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          <FormControlLabel
            value="A"
            control={<Radio />}
            label={`A) ${question.a}`}
            disabled={disabled}
            ref={value === "A" ? correctButtonRef : null}
            sx={{ marginBottom: "10px" }}
            componentsProps={{
              typography: {
                sx: {
                  "&.Mui-disabled": {
                    color:
                      "A" !== question.answer
                        ? "red !important"
                        : "green !important",
                  },
                },
              },
            }}
          />
          <FormControlLabel
            value="B"
            control={<Radio />}
            label={`B) ${question.b}`}
            disabled={disabled}
            ref={value === "B" ? correctButtonRef : null}
            sx={{ marginBottom: "10px" }}
            componentsProps={{
              typography: {
                sx: {
                  "&.Mui-disabled": {
                    color:
                      "B" !== question.answer
                        ? "red !important"
                        : "green !important",
                  },
                },
              },
            }}
          />
          <FormControlLabel
            value="C"
            control={<Radio />}
            label={`C) ${question.c}`}
            disabled={disabled}
            ref={value === "C" ? correctButtonRef : null}
            sx={{ marginBottom: "10px" }}
            componentsProps={{
              typography: {
                sx: {
                  "&.Mui-disabled": {
                    color:
                      "C" !== question.answer
                        ? "red !important"
                        : "green !important",
                  },
                },
              },
            }}
          />
          {question.d && (
            <FormControlLabel
              value="D"
              control={<Radio />}
              label={`D) ${question.d}`}
              disabled={disabled}
              ref={value === "D" ? correctButtonRef : null}
              sx={{ marginBottom: "10px" }}
              componentsProps={{
                typography: {
                  sx: {
                    "&.Mui-disabled": {
                      color:
                        "D" !== question.answer
                          ? "red !important"
                          : "green !important",
                    },
                  },
                },
              }}
            />
          )}
          {question.e && (
            <FormControlLabel
              value="E"
              control={<Radio />}
              label={`E) ${question.e}`}
              disabled={disabled}
              ref={value === "E" ? correctButtonRef : null}
              sx={{ marginBottom: "10px" }}
              componentsProps={{
                typography: {
                  sx: {
                    "&.Mui-disabled": {
                      color:
                        "E" !== question.answer
                          ? "red !important"
                          : "green !important",
                    },
                  },
                },
              }}
            />
          )}
        </RadioGroup>
        <CSSTransition
          in={hiddenBox}
          timeout={6000}
          classNames="fade"
          unmountOnExit
        >
          <div className={`${shake ? "shake" : ""}`}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: message === "Respuesta correcta" ? "#00A388" : "#F0443F",
                color: "white",
                borderRadius: "5px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "30px",
                gap: 1,
              }}
            >
              {message === "Respuesta correcta" ? (
                <CheckCircleIcon sx={{ fontSize: 30 }} />
              ) : (
                <CancelIcon sx={{ fontSize: 30 }} />
              )}
              <Typography variant="h6">{message}</Typography>
            </Box>
          </div>
        </CSSTransition>
      </FormControl>
    </>
  );
};

export default Question;
