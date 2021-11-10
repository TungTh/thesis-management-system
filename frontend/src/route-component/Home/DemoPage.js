import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useHistory } from "react-router-dom";
import NavigationBar from "../../presentational-components/NavigationBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default function DemoPage() {
  const classes = useStyles();
  const history = useHistory();
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/demo")}>Home</MenuItem>,
  ];
  return (
    <React.Fragment>
      <div className={classes.root}>
        <NavigationBar options={navigationBarFunction} />
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
        </div>
      </div>
    </React.Fragment>
  );
}
