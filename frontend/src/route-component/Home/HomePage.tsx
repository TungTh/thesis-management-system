import { useQuery } from "@apollo/client";
import { Container, Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { LoadingDialog } from "../../presentational-components/Dialog";
import NavigationBar from "../../presentational-components/NavigationBar";
import { ThesisModal } from "../../presentational-components/ThesisModal";
import { GQLThesis } from "../../schemaTypes";
import { ALLTHESES_QUERY } from "../../service-component/API/query";
import { AuthorizationContext } from "../../service-component/Context/authorization";

const useStyles = makeStyles((theme) => ({
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
  container: {
    position: "absolute",
    height: "90vh",
    justifyContent: "space-between",
    overflow: "auto",
  },
}));

interface ThesesData {
  allTheses: GQLThesis[];
}

export default function HomePage() {
  const classes = useStyles();
  const history = useHistory();
  const AuthContext = useContext(AuthorizationContext);
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/home")}>Home</MenuItem>,
    (AuthContext.status && (
      <MenuItem onClick={() => history.push("/dashboard")}>
        Management System
      </MenuItem>
    )) || <MenuItem onClick={() => history.push("/")}>Login</MenuItem>,
  ];

  const theses = useQuery<ThesesData>(ALLTHESES_QUERY, {
    pollInterval: 30000,
  });

  console.log(theses);

  if (theses.error) {
    console.log(theses.error);
    return <div>Error loading theses! Please contact an administrator!</div>;
  }

  return (
    <React.Fragment>
      {theses.loading && <LoadingDialog open={true} />}
      <div className={classes.root}>
        <NavigationBar
          options={navigationBarFunction}
          title="HCMIU Thesis Repository"
        />
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Grid
            container
            className={classes.container}
            component={Container}
            maxWidth={false}
          >
            {theses.data &&
              theses.data.allTheses.map((thesis) => (
                <Grid
                  item
                  key={thesis.id}
                  component={ThesisModal}
                  thesis={thesis}
                  xs={12}
                  sm={3}
                />
              ))}
            <Grid
              item
              component={ThesisModal}
              thesis={{
                id: "test",
                title: "Thesis Title",
                studentName: "Student Name",
                studentID: "Student ID",
                supervisorName: "Supervisor Name",
                semester: "Semester",
                namespace: {
                  name: "Test Namespace",
                },
                user: {
                  id: "testuserid",
                  name: "Test User",
                  username: "testuser",
                },
                tags: [
                  {
                    name: "TestTag",
                  },
                  {
                    name: "AnotherTestTag",
                  },
                ],
              }}
              xs={12}
              sm={3}
            ></Grid>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
}
