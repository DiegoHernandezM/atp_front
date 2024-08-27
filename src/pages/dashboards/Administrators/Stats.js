import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { rgba } from "polished";

import {
  Box,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

const Typography = styled(MuiTypography)(spacing);

const illustrationCardStyle = (props) => css`
  ${props.illustration &&
  props.theme.palette.mode !== "dark" &&
  `
    background: ${rgba(props.theme.palette.primary.main, 0.125)};
    color: ${props.theme.palette.primary.main};
  `}
`;

const Card = styled(MuiCard)`
  position: relative;

  ${illustrationCardStyle}
`;

const CardContent = styled(MuiCardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};

  span {
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const IllustrationImage = styled.img`
  height: 110px;
  position: absolute;
  right: ${(props) => props.theme.spacing(1)};
  bottom: ${(props) => props.theme.spacing(1)};
  display: none;

  ${(props) => props.theme.breakpoints.between("xs", "lg")} {
    display: block;
  }

  @media (min-width: 1700px) {
    display: block;
  }
`;

const Stats = ({
  title,
  amount,
  chip,
  percentagetext,
  percentagecolor,
  illustration,
  additionalText,
}) => {
  return (
    <Card illustration={illustration}>
      <CardContent>
        <Typography variant="h6" mb={6}>
          {title}
        </Typography>
        <Typography variant="h3" mb={6}>
          <Box fontWeight="fontWeightRegular">{amount}</Box>
        </Typography>
        {!illustration && <Chip label={chip} />}
      </CardContent>
      <Typography variant="h6" ml={2}>
        {additionalText}
      </Typography>
      {!!illustration && (
        <IllustrationImage src={illustration} alt="Illustration" />
      )}
    </Card>
  );
};

export default Stats;
