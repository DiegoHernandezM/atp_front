import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";
import { goOnline, goOffline } from "./redux/slices/onlinestatus";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useAuth from "./hooks/useAuth";

import "./i18n";
import createTheme from "./theme";
import Router from "./routes";

import useTheme from "./hooks/useTheme";
import { persistor } from "./redux/store";
import createEmotionCache from "./utils/createEmotionCache";

import { AuthProvider } from "./contexts/JWTContext";
import Progress from "./pages/components/Progress";
import { PersistGate } from "redux-persist/integration/react";
import CheckConnection from "./components/check-offline/CheckConnection";

const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
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
    <CheckConnection>
      <CacheProvider value={emotionCache}>
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
      </CacheProvider>
    </CheckConnection>
  );
}

export default App;
