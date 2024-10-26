/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

const AuhtContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return initialState;
    default:
      throw new Error("unknown action");
  }
}

export function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuhtContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuhtContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuhtContext);
  if (context === undefined)
    throw new Error("using context outside the provider");
  return context;
}
