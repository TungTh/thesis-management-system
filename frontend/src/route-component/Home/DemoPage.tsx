import { Container } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useHistory } from "react-router-dom";
import NavigationBar from "../../presentational-components/NavigationBar";
import { ThesisModal } from "../../presentational-components/ThesisModal";

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
    top: "10%",
    left: "10%",
  },
}));

export default function DemoPage() {
  const classes = useStyles();
  const history = useHistory();
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/demo")}>Home</MenuItem>,
    <MenuItem onClick={() => history.push("/")}>Login</MenuItem>,
  ];
  return (
    <React.Fragment>
      <div className={classes.root}>
        <NavigationBar
          options={navigationBarFunction}
          title="HCMIU Thesis Repository"
        />
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="sm" className={classes.container}>
            <ThesisModal
              thesis={{
                id: "test",
                title: "Thesis Title",
                studentName: "Student Name",
                supervisorName: "Supervisor Name",
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
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
}
