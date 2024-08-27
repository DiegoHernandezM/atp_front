import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { HOST_API } from "../config";
// utils
import axios from "../utils/axios";
import { isValidToken, setSession } from "../utils/jwt";
import { db } from "../database";
import { v4 as uuidv4 } from 'uuid';
// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  SIGN_IN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  SIGN_UP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: "jwt",
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  resetPassword: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get(`${HOST_API}/api/user`);
          const u = response.data;
          if (localStorage.getItem("dashone") === "true") {
            preloadUser(u)
          }
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: u,
            },
          });
        } else {
          db.user.toArray()
            .then(firstUser => {
              if (firstUser) {
                dispatch({
                  type: "INITIALIZE",
                  payload: {
                    isAuthenticated: true,
                    user: firstUser,
                  },
                });
              }
            })
            .catch(error => {
              console.error('Error al obtener el primer registro:', error);
            });
        }
      } catch (err) {
        console.error(err);
        db.user.toArray()
          .then(firstUser => {
            if (firstUser) {
              dispatch({
                type: "INITIALIZE",
                payload: {
                  isAuthenticated: true,
                  user: firstUser,
                },
              });
            }
          })
          .catch(error => {
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          });
      }
    };

    initialize();
  }, []);

  const preloadUser = (user) => {
    if (user) {
      db.user.where('id').equals(user.id).first()
        .then(existingItem => {
          if (!existingItem) {
            db.user.add(user);
          }
        })
        .catch(error => {
          console.error('Error al validar la clave:', error);
        });
    }
  };

  const signIn = async (email, password) => {
    const deviceId = localStorage.getItem('deviceId') || uuidv4();
    localStorage.setItem('deviceId', deviceId);
    const response = await axios.post(`${HOST_API}/api/login`, {
      username: email,
      password,
      device_id: deviceId,
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);
    localStorage.setItem("user", user.displayName);
    localStorage.setItem("usertype", user.type_id);
    localStorage.setItem("dashone", true);
    localStorage.setItem("record", "no");
    dispatch({
      type: "SIGN_IN",
      payload: {
        user,
      },
    });
  };

  const signUp = async (email, password, firstName, lastName) => {
    const response = await axios.post(`${HOST_API}/api/auth/sign-up`, {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem("accessToken", accessToken);
    dispatch({
      type: "SIGN_UP",
      payload: {
        user,
      },
    });
  };

  const signOut = async () => {
    setSession(null);
    const  deviceId = window.localStorage.getItem("deviceId");
    await axios.post(`${HOST_API}/api/logout`, {
      device_id: deviceId,
    });
    localStorage.setItem("user", null);
    localStorage.setItem("usertype", null);
    dispatch({ type: "LOGOUT" });
  };

  const resetPassword = async (email) => {
    await axios.post(`${HOST_API}/api/reset-password`, {
      email
    });
  };

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
