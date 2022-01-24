import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./route-component/Authorization/LandingPage";
import SignUpPage from "./route-component/Authorization/SignUpPage";
import ForgotPasswordPage from "./route-component/Authorization/ForgotPasswordPage";
import Dashboard from "./route-component/Home/Management/Dashboard";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { AuthorizationContext } from "./service-component/Context/authorization";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import HomePage from "./route-component/Home/HomePage";
import SignOutPage from "./route-component/Authorization/SignOutPage";

// https://coolors.co/fcba04-ffebeb-590004
const theme = createTheme({
  palette: {
    primary: {
      light: "#3596e6",
      main: "#2a7cbf",
      dark: "#20659e",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#72ff59",
      main: "#4cbf37",
      dark: "#347d27",
      contrastText: "#ffffff",
    },
    action: {
      hover: "#cccccc",
    },
    background: {
      default: "#e5e5e5",
      paper: "#f6f6f6",
    },
    text: {
      primary: "#000000",
      secondary: "#858585",
      hint: "#b3b3b3",
    },
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError", networkError);
  }
});

const httpLink = createHttpLink({
  uri: process.env.API_URL || "http://localhost:4000/graphql",
  credentials: "include",
});

var token: string;
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(ApolloLink.from([errorLink, httpLink])),
  cache: new InMemoryCache({
    typePolicies: {
      Test: {
        merge: false,
      },
    },
  }),
});

export default function App() {
  const [authorizationData, setAuthorizationData] = useState({
    status: false,
    token: "",
    user: {
      id: "",
      username: "",
      role: {
        name: "",
      },
    },
  });

  token = authorizationData.token ? authorizationData.token : "";

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <AuthorizationContext.Provider
          value={{
            ...authorizationData,
            setAuthorization: setAuthorizationData,
          }}
        >
          <BrowserRouter basename="/ezk8s">
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/create-account" component={SignUpPage} />
              <Route
                exact
                path="/forgot-password"
                component={ForgotPasswordPage}
              />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/home" component={HomePage} />
              <Route path="/signout" component={SignOutPage} />
            </Switch>
          </BrowserRouter>
        </AuthorizationContext.Provider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
