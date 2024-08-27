import React from "react";
import useAuth from "./hooks/useAuth";
import async from "./components/Async";
import { Navigate, useRoutes } from "react-router-dom";
import { useDispatch } from "react-redux";

// All pages that rely on 3rd party components (other than MUI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import PresentationLayout from "./layouts/Presentation";

// Guards
import AuthGuard from "./components/guards/AuthGuard";

// App

// Auth components
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";

// Landing
import Landing from "./pages/presentation/Landing";
const Questions = async(() => import("./pages/dashboards/Questions"));
const Administrators = async(() => import("./pages/dashboards/Administrators"));
const Subjects = async(() => import("./pages/dashboards/Subjects"));

const SaaS = async(() => import("./pages/dashboards/SaaS"));
const App = async(() => import("./pages/App"));
const Tests = async(() => import("./pages/App/Tests"));
const Results = async(() => import("./pages/App/Results"));
const DashboardAppLayout = async(() =>
  import("./pages/App/DashboardAppLayout")
);
const DashboardApp = async(() => import("./pages/App/DashboardApp"));
// Form components
const Pickers = async(() => import("./pages/forms/Pickers"));
const Editors = async(() => import("./pages/forms/Editors"));
const Formik = async(() => import("./pages/forms/Formik"));

// Icon components
const Profile = async(() => import("./pages/dashboards/Users/Profile"));
const CustomLanding = async(() => import("./pages/dashboards/Landing/CustomLanding"));
//Users
const Users = async(() => import("./pages/dashboards/Users"));

// Call this function when you want to preload questions

export default function Router() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const type = localStorage.getItem("usertype");

  return useRoutes([
    {
      path: "/",
      element: <PresentationLayout />,
      children: [
        {
          path: "",
          element: <Landing />,
        },
      ],
    },
    {
      path: "dashboardapp",
      element:
        type === "3" ? (
          <AuthGuard>
            <DashboardAppLayout />
          </AuthGuard>
        ) : (
          <AuthGuard>
            <Page404 />
          </AuthGuard>
        ),
      children: [
        {
          path: "",
          element: <DashboardApp />,
        },
        {
          path: "app",
          element: <App />,
        },
        {
          path: "test",
          element: <Tests />,
        },
        {
          path: "results",
          element: <Results />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "dashboard",
      element:
        type === "1" ? (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ) : (
          <Navigate to="/dashboardapp" replace />
        ),
      children: [
        {
          path: "",
          element: <Administrators />,
        },
        {
          path: "questions",
          element: <Questions />,
        },
        {
          path: "subjects",
          element: <Subjects />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "landing",
          element: <CustomLanding />,
        }
      ]
    },
    {
      path: "pages",
      element: user?.type_id === 1 ? <DashboardLayout /> : <Page404 />,
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "auth",
      element: <AuthLayout />,
      children: [
        {
          path: "sign-in",
          element: <SignIn />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "404",
          element: <Page404 />,
        },
        {
          path: "500",
          element: <Page500 />,
        },
      ],
    },
    {
      path: "*",
      element: <AuthLayout />,
      children: [
        {
          path: "*",
          element: <Page404 />,
        },
      ],
    },
  ]);
}
