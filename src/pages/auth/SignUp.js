import React, { useState } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepContent,
  Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createUser, findUserByEmail } from "../../redux/slices/users";
import { createPayment } from "../../redux/slices/paypal";
import ThemedLogo from "../../components/ThemeLogo";
import SignUpComponent from "../../components/auth/SignUp";
import DialogSignUpComponent from "../../components/auth/DialogSignUp";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;


function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const amount = "479.00";
  const description = "Pago para accesar a la APP";
  const style = {"layout":"vertical", "height":33};
  const [open, setOpen] = useState(false);

  const handleCreateUser = (values) => {
    dispatch(createUser(values));
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleChangeEmail = (e) => {
    dispatch(findUserByEmail(e.target.value)).then((response) => {
      if(Object.keys(response.data).length > 0) {
        console.log(response.data.email);
        setOpen(true);
      }
    });
  };
  const handleAgree = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setOpen(false);
  }
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleSavePayment = (order) => {
    dispatch(createPayment(order)).then((response) => {
      if(Object.keys(response).length > 0) {
        console.log(order);
        navigate("/auth/sign-in");
      }
    });
  };

  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title="Registro" />
        <Box align="center">
          <ThemedLogo alt="logo" align="center"/>
        </Box>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Ingresa tus datos
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Explicacion de costos y uso de app
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          <Step key={1}>
              <StepLabel>
                Completa tu información personal
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2, sm: 2, lg: 2 }}>
                  <SignUpComponent
                    handleCallBack={handleCreateUser}
                    handleChangeEmail={handleChangeEmail}
                  />
                </Box>
              </StepContent>
          </Step>
          <Step key={2}>
              <StepLabel>
                Realiza el pago para tener acceso a la APP
              </StepLabel>
              <StepContent style={{ width:"300px" }}>
                <PayPalButtons
                  style={style}
                  forceReRender={[user.id]}
                  createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                  reference_id: user.id,
                                  description: description,
                                  amount: {
                                      value: amount,
                                  },
                                },
                            ],
                        })
                        .then((orderId) => {
                            return orderId;
                        });
                  }}
                  onApprove={ async (data, actions) => {
                    const order = await actions.order?.capture();
                    handleSavePayment(order);
                  }}
                />
              </StepContent>
          </Step>
        </Stepper>
      </Wrapper>
      <DialogSignUpComponent open={open} handleClose={() => {setOpen(false)}} handleAgree={handleAgree}/>
    </React.Fragment>
  );
}

export default SignUp;
