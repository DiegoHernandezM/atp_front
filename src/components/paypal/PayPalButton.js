import React from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import useAuth from "../../hooks/useAuth";

import { Box } from "@mui/material";

PayPalButton.popTypes = {
    createO: PropTypes.func
}
export default function PayPalButton({ createO }) {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  return (
    <Box style={{ width: '50px!important' }}>
      <PayPalButtons
        forceReRender={[createO.reference_id]}
        createOrder={createO}
        onApprove={ async (data, actions) => {
          const order = await actions.order?.capture();
          console.log(order);
          navigate("/auth/sign-in");
        }}
      />
    </Box>
  )
}