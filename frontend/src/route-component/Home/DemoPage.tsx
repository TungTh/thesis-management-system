import { useQuery } from "@apollo/client";
import { Container, Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useHistory } from "react-router-dom";
import { LoadingDialog } from "../../presentational-components/Dialog";
import NavigationBar from "../../presentational-components/NavigationBar";
import { ThesisModal } from "../../presentational-components/ThesisModal";
import { GQLThesis } from "../../schemaTypes";
import { ALLTHESES_QUERY } from "../../service-component/API/query";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    position: "absolute",
    height: "90vh",
  },
}));

interface ThesesData {
  allTheses: GQLThesis[];
}

export default function DemoPage() {
  const classes = useStyles();
  const history = useHistory();
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/demo")}>Home</MenuItem>,
    <MenuItem onClick={() => history.push("/")}>Login</MenuItem>,
  ];

  const theses = useQuery<ThesesData>(ALLTHESES_QUERY);

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
          <Grid container className={classes.container} component={Container}>
            {theses.data &&
              theses.data.allTheses.map((thesis) => (
                <Grid item component={ThesisModal} thesis={thesis} />
              ))}
            <ThesisModal
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
              }}
            ></ThesisModal>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
}
