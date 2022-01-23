import { useMutation } from "@apollo/client";
import { Box, Container, Theme } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useContext } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { AuthorizationContainer } from "../../../container-components/Authorization/AuthorizationContainer";
import { DeploymentModal } from "../../../presentational-components/DeploymentModal";
import NavigationBar from "../../../presentational-components/NavigationBar";
import { TextWithLink } from "../../../presentational-components/Text";
import { SIGNOUT_MUTATION } from "../../../service-component/API/mutation";
import { AuthorizationContext } from "../../../service-component/Context/authorization";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundImage: "linear-gradient(#ffffff, #FFD580)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  box: {
    display: "flex",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const [signOut] = useMutation(SIGNOUT_MUTATION);
  const AuthContext = useContext(AuthorizationContext);
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/home")}>Home</MenuItem>,
    <MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>,
  ];

  const handleSignOut = () => {
    signOut()
      .then((data) => {
        AuthContext.setAuthorization({
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
      })
      .catch();
  };

  if (!AuthContext.token) return <Redirect to="/" />;

  return (
    <AuthorizationContainer>
      <div className={classes.root}>
        <NavigationBar
          options={navigationBarFunction}
          title="HCMIU Thesis Management System"
        />
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Box className={classes.box}>
            <Container
              maxWidth={false}
              disableGutters={true}
              className={classes.container}
            >
              <Box className={classes.box}>
                {/* <DeploymentModal model={} /> */}
              </Box>
              <Box className={classes.box}>tsetse</Box>
              <Box className={classes.box}>set</Box>
            </Container>
          </Box>
        </div>
      </div>
    </AuthorizationContainer>
  );
}
