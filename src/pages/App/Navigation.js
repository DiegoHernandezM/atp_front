import React, { useState, useEffect } from "react";
import { withTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Slide,
  Toolbar,
  DialogContent,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { db } from "../../database";
import {
  saveAnswerOffline,
  endTestOffline,
  saveFullTestOffline,
} from "../../redux/slices/usertests";
import { makeStyles } from "@mui/styles";

import {
  Quiz as QuizIcon,
  Subject as SubjectIcon,
  Checklist as CheckListIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const NavbarSimple = ({ onDrawerToggle }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [open, setOpen] = useState(localStorage.getItem("dashone") === "true");
  const [isDashboard, setIsDashboard] = useState(
    localStorage.getItem("record")
  );

  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const routesToNavigate = [
    "/dashboardapp/app",
    "/dashboardapp/test",
    "/dashboardapp/results",
    "/dashboardapp",
  ];
  const delayBetweenRoutes = 200;
  const currentPath = window.location.pathname;
  const { isOnline } = useSelector((state) => state.onlinestatus);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log("entro al primer window", event);
      window.deferredPrompt = event;
      setIsReadyForInstall(true);
    });
    if (deferredInstallPrompt === null) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Previene a la mini barra de información que aparezca en smartphones
        e.preventDefault();
        // Guarda el evento para que se dispare más tarde
        setDeferredInstallPrompt(e);
        // Actualizar la IU para notificarle al usuario que se puede instalar tu PWA

        // De manera opcional, envía el evento de analíticos para saber si se mostró la promoción a a instalación del PWA
        console.log(`'beforeinstallprompt' event was fired.`);
      });
    }
  }, []);

  useEffect(() => {
    if (open === true && isDashboard !== "dashboardapp") {
      const interval = setInterval(() => {
        if (currentRouteIndex < routesToNavigate.length) {
          console.log(routesToNavigate[currentRouteIndex]);
          navigate(routesToNavigate[currentRouteIndex]);
          setCurrentRouteIndex(currentRouteIndex + 1);
        } else {
          clearInterval(interval);
          navigate("/dashboardapp");
          localStorage.setItem("record", "dashboardapp");
          setOpen(false);
        }
      }, delayBetweenRoutes);
      return () => clearInterval(interval);
    }
    console.log(currentPath, ": estoy en");
    localStorage.setItem("record", "dashboardapp");
    setOpen(false);
  }, [currentRouteIndex, navigate, routesToNavigate.length, open]);

  useEffect(() => {
    if (isOnline) {
      const sendRequestsWhenOnline = async () => {
        const records = await db.table("saveanswers").toArray();
        const recordsEndTest = await db.table("endtest").toArray();
        const fulltests = await db.infotest
          .where("user_id")
          .equals(0)
          .toArray();
        if (fulltests.length > 0) {
          dispatch(saveFullTestOffline(fulltests));
        }
        if (records.length > 0) {
          dispatch(saveAnswerOffline(records[0].params));
        }
        if (recordsEndTest.length > 0) {
          dispatch(endTestOffline(recordsEndTest));
        }
      };
      sendRequestsWhenOnline();

      const deleteTable = async () => {
        if ((await db.table("saveanswers").count()) > 0) {
          await db.table("saveanswers").clear();
        }
        if ((await db.table("endtest").count()) > 0) {
          await db.table("endtest").clear();
        }
        if ((await db.infotest.where("user_id").equals(0).count()) > 0) {
          await db.infotest.where("user_id").equals(0).delete();
        }
      };
      deleteTable();
    }
  }, [isOnline]);

  async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      console.log("oops, no prompt event guardado en window");
      return;
    }
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
    window.deferredPrompt = null;
    setIsReadyForInstall(false);
  }

  const press = (e) => {
    console.log("deferredinstall", deferredInstallPrompt);
    console.log("isReady", isReadyForInstall);
    // saveBeforeInstallPromptEvent(e);
    installPWA(e);
  };

  // CODELAB: Add event listener for beforeinstallprompt event
  // window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

  /**
   * Event handler for beforeinstallprompt event.
   *   Saves the event & shows install button.
   *
   * @param {Event} evt
   */
  function saveBeforeInstallPromptEvent(evt) {
    console.log("ahoy");
    // CODELAB: Add code to save event & show the install button.
    deferredInstallPrompt = evt;
    console.log("HERE");
  }

  /**
   * Event handler for butInstall - Does the PWA installation.
   *
   * @param {Event} evt
   */
  function installPWA(evt) {
    // CODELAB: Add code show install prompt & hide the install button.
    console.log("Clicked");
    console.log(deferredInstallPrompt);
    deferredInstallPrompt.prompt(); //LINE 50 HERE**
    // Hide the install button, it can't be called twice.
    // evt.srcElement.setAttribute('hidden', true);
    // CODELAB: Log user response to prompt.
    deferredInstallPrompt.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("User accepted the A2HS prompt", choice);
      } else {
        console.log("User dismissed the A2HS prompt", choice);
      }
      // setDeferredInstallPrompt = null;
    });
  }

  // CODELAB: Add event listener for appinstalled event

  /**
   * Event handler for appinstalled event.
   *   Log the installation to analytics or save the event somehow.
   *
   * @param {Event} evt
   */
  function logAppInstalled(evt) {
    // CODELAB: Add code to log the event
    window.addEventListener("appinstalled", logAppInstalled);
    console.log("Weather App was installed.", evt);
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
      }}
      elevation={10}
    >
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Inicio"
          icon={<HomeIcon />}
          onClick={() => navigate("/dashboardapp")}
        />
        <BottomNavigationAction
          label="Materias"
          icon={<SubjectIcon />}
          onClick={() => navigate("/dashboardapp/app")}
        />
        <BottomNavigationAction
          label="Test Simulacro"
          icon={<QuizIcon />}
          disabled={currentPath === "/dashboardapp/test"}
          onClick={() => navigate("/dashboardapp/test")}
        />
        <BottomNavigationAction
          label="Progreso y Resultados"
          icon={<CheckListIcon />}
          onClick={() => navigate("/dashboardapp/results")}
        />
      </BottomNavigation>
      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        style={{ background: "white" }}
        fullScreen
      >
        <DialogContent>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Box display="flex" justifyContent="center" alignItems="center">
                <div className={classes.root}>
                  <CircularProgress />
                </div>
              </Box>
            </Toolbar>
          </AppBar>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default withTheme(NavbarSimple);
