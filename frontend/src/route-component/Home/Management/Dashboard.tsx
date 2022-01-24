import { useQuery } from "@apollo/client";
import { Box, Container, Theme } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthorizationContainer } from "../../../container-components/Authorization/AuthorizationContainer";
import { LoadingDialog } from "../../../presentational-components/Dialog";
import NavigationBar from "../../../presentational-components/NavigationBar";
import { TextWithLink } from "../../../presentational-components/Text";
import { GQLUser } from "../../../schemaTypes";
import { USER_BY_ID_QUERY } from "../../../service-component/API/query";
import { AuthorizationContext } from "../../../service-component/Context/authorization";
import AdminDashboard from "./AdminDashboard";

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
    width: "100%",
    justifyContent: "space-between",
  },
  container: {
    width: "100%",
    padding: theme.spacing(2),
  },
}));

interface UserData {
  userById: GQLUser;
}

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const AuthContext = useContext(AuthorizationContext);
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/home")}>Home</MenuItem>,
    <MenuItem onClick={() => history.push("/signout")}>Sign Out</MenuItem>,
  ];

  const { user } = AuthContext;

  const query = useQuery<UserData>(USER_BY_ID_QUERY, {
    variables: { id: user.id },
  });

  if (user.role.name === "Admin") return <AdminDashboard />;

  return (
    <AuthorizationContainer>
      <div className={classes.root}>
        {query.loading && <LoadingDialog open={true} />}
        <NavigationBar
          options={navigationBarFunction}
          title="HCMIU Thesis Management System"
        />
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          {() => {
            const namespace = query.data?.userById?.thesis?.namespace;

            if (!namespace) {
              return (
                <Box className={classes.box}>
                  <Container className={classes.container}>
                    <TextWithLink
                      value="You have not yet created your thesis. Click here to create one."
                      to="/dashboard/create-thesis"
                    />
                  </Container>
                </Box>
              );
            }
            return (
              <Box className={classes.box}>
                <Container
                  maxWidth={false}
                  disableGutters={true}
                  className={classes.container}
                >
                  <Box className={classes.box}>{/* <DeploymentModal /> */}</Box>
                  <Box className={classes.box}>tsetse</Box>
                  <Box className={classes.box}>set</Box>
                </Container>
              </Box>
            );
          }}
        </div>
      </div>
    </AuthorizationContainer>
  );
}
