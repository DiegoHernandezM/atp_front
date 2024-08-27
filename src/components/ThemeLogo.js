import React from "react";
import { useTheme } from "@emotion/react";
import { ReactComponent as LogoDark } from "../vendor/logo-theme-black.svg";
import { ReactComponent as LogoLight } from "../vendor/logo-theme-white.svg";
import styled from "@emotion/styled";

const ThemedLogo = styled(({ className }) => {
  const theme = useTheme();
  return theme.palette.mode === 'dark' ? <LogoDark className={className} /> : <LogoLight className={className} />;
})`
  fill: ${(props) => props.theme.palette.primary.main};
  width: 200px;
  height: 200px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)};
`;

export default ThemedLogo;
