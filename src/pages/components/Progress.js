import React, { useState } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CircularProgress as MuiCircularProgress,
  Divider as MuiDivider,
  LinearProgress as MuiLinearProgress,
  Paper as MuiPaper,
  Box,
  Container,
} from "@mui/material";
import { spacing } from "@mui/system";
import planeGift from "../../vendor/d0980bb2312e930e2fdf31a2c13577af.gif";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const CircularProgress = styled(MuiCircularProgress)(spacing);

const LinearProgress = styled(MuiLinearProgress)(spacing);

const Wrapper = styled.div`
  padding-top: 3.5rem;
  position: relative;
  text-align: center;
  overflow: hidden;

  @keyframes perspectiveAnimation {
    from {
      opacity: 0.1;
      transform: perspective(1500px) rotateX(0deg);
    }

    to {
      opacity: 1;
      transform: perspective(2000px) rotateX(25deg);
    }
  }

  .animate__perspective {
    animation-name: perspectiveAnimation;
  }
`;

const ImageBack = styled.img`
  max-width: 100%;
  height: auto;
  min-height: 33vh;
  display: block;
  box-shadow: 0 6px 18px 0 rgba(18, 38, 63, 0.075);
  border-radius: 5px;
  z-index: 0;
  opacity: 0.1;
  image-rendering: optimizequality;
  image-rendering: -webkit-optimize-contrast;
  margin-bottom: -100px;
  margin-top: -35px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
`;

const ImageWrapper = styled.div`
  background-attachment: fixed;
  &:before {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.02));
    bottom: 0;
    left: 0;
    position: absolute;
    content: " ";
    z-index: 1;
    display: block;
    width: 50%;
    height: 75px;
    pointer-events: none;
  }
`;

function Progress() {
  return (
    <Wrapper>
      <Container>
        <ImageWrapper style={{ alignItems:'center' }}>
          <ImageBack
            alt="App de aviacion"
            src={planeGift}
          />
        </ImageWrapper>
      </Container>
    </Wrapper>
  );
}

export default Progress;
