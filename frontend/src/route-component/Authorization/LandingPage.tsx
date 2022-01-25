import { useMutation } from "@apollo/client";
import { Grid, Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { ActionButton } from "../../presentational-components/Button";
import {
  ErrorDialog,
  LoadingDialog,
} from "../../presentational-components/Dialog";
import {
  PasswordInput,
  TextInput,
} from "../../presentational-components/Input";
import { TextWithLink, TitleText } from "../../presentational-components/Text";
import {
  REFRESHJWT_MUTATION,
  SIGNIN_MUTATION,
} from "../../service-component/API/mutation";
import { AuthorizationContext } from "../../service-component/Context/authorization";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100vh",
    backgroundImage:
      "url(https://dean1665.vn/uploads/school/dhqt-dhqg_hcm.jpg)",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

export default function LandingPage() {
  const classes = useStyles();
  const history = useHistory();
  const [signInInfo, setSignInInfo] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("undefined");
  const [signIn, { loading }] = useMutation(SIGNIN_MUTATION);
  const AuthContext = useContext(AuthorizationContext);
  const [refreshJWT, { loading: refreshLoading }] =
    useMutation(REFRESHJWT_MUTATION);

  useEffect(() => {
    (async () => {
      try {
        const data = await refreshJWT();
        AuthContext.setAuthorization({
          status: true,
          token: data.data.refreshJWT.token,
          user: {
            id: data.data.refreshJWT.user.id,
            username: data.data.refreshJWT.user.username,
            role: {
              name: data.data.refreshJWT.user.role.name,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [AuthContext, refreshJWT]);

  const handleSignInChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setSignInInfo({ ...signInInfo, [prop]: event.target.value });
    };

  const handleSignInClick = async () => {
    signIn({
      variables: {
        username: signInInfo.username,
        password: signInInfo.password,
      },
      errorPolicy: "none",
    })
      .then((data) => {
        AuthContext.setAuthorization({
          status: true,
          token: data.data.login.token,
          user: {
            id: data.data.login.user.id,
            username: data.data.login.user.username,
            role: {
              name: data.data.login.user.role.name,
            },
          },
        });
        history.push("/dashboard");
      })
      .catch((error) => {
        setError("Could not sign in! Please try again.");
      });
  };

  const handleGoToHomeClick = async () => {
    history.push("/home");
  };

  if (AuthContext.token) return <Redirect to="/dashboard" />;
  return (
    <React.Fragment>
      {loading && <LoadingDialog open={loading} />}
      {error !== "undefined" && (
        <ErrorDialog
          error="Invalid username/password. Please try again!"
          open={true}
          onClose={() => setError("undefined")}
        />
      )}
      {!refreshLoading && (
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={8}></Grid>
          <Grid item xs={12} sm={8} md={4} component={Paper}>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <TitleText value="Sign In" fontSize="18px" />
              <form className={classes.form}>
                <TextInput
                  label="Username"
                  id="username"
                  value={signInInfo.username}
                  onChange={handleSignInChange("username")}
                />

                <PasswordInput
                  label="Password"
                  id="password"
                  value={signInInfo.password}
                  onChange={handleSignInChange("password")}
                  onEnter={handleSignInClick}
                />

                <ActionButton
                  value="Sign In"
                  onClick={() => handleSignInClick()}
                />
                <Grid container direction="row" justifyContent="flex-end">
                  <Grid item xs>
                    <TextWithLink
                      value="Forgot password!"
                      to="/forgot-password"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextWithLink
                      value="Don't have an account?"
                      to="/create-account"
                      align="right"
                    />
                  </Grid>
                </Grid>
              </form>
            </div>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <VisibilityIcon />
              </Avatar>
              <TitleText value="Just taking a look?" fontSize="18px" />
              <form className={classes.form}>
                <ActionButton
                  value="Go to thesis repository homepage"
                  onClick={() => handleGoToHomeClick()}
                />
              </form>
            </div>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}
