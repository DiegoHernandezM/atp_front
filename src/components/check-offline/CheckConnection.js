import React, {useEffect} from "react";
import { Detector } from "react-detect-offline";
import { Button } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import {Navigate} from "react-router-dom";
import {Helmet, HelmetProvider} from "react-helmet-async";
import createEmotionCache from "../../utils/createEmotionCache";
import { PersistGate } from "redux-persist/integration/react";
import Progress from "../../pages/components/Progress";
import {persistor} from "../../redux/store";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import createTheme from "../../theme";
import {AuthProvider} from "../../contexts/JWTContext";
import Router from "../../routes";
import {CacheProvider} from "@emotion/react";
import {useDispatch} from "react-redux";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import {goOffline, goOnline} from "../../redux/slices/onlinestatus";
const clientSideEmotionCache = createEmotionCache();
const CheckConnection = (props, emotionCache = clientSideEmotionCache ) => {
  const dispatch = useDispatch();
  const { isInitialized, user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleOnline = () => dispatch(goOnline());
    const handleOffline = () => dispatch(goOffline());

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return (
    <>
      <Detector
        render={({online}) =>
          online ?
            (props.children) : (
              <HelmetProvider>
                <Helmet titleTemplate="%s | App" defaultTitle="App - Aviación" />
                <PersistGate loading={<Progress />} persistor={persistor}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MuiThemeProvider theme={createTheme(theme)}>
                      <AuthProvider>
                        {isInitialized ? <Router /> : <Progress />}
                      </AuthProvider>
                    </MuiThemeProvider>
                  </LocalizationProvider>
                </PersistGate>
              </HelmetProvider>
            )
        }
      />
    </>
  );
}

export default CheckConnection;