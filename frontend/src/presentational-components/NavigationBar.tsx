import Toolbar from "@material-ui/core/Toolbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppBar from "@material-ui/core/AppBar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { TitleText, TitleTextWithLink } from "./Text";
import { DropdownButton } from "./Button";
import { FC } from "react";

interface NavigationBarProps {
  title: string;
  options: JSX.Element[];
}

const useStyles = makeStyles((theme) => ({
  toolBar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    justifyContent: "space-between",
    overflowX: "auto",
  },
  appBar: {
    marginBottom: theme.spacing(0),
  },
}));

const NavigationBar: FC<NavigationBarProps> = (props) => {
  const classes = useStyles();
  return (
    <AppBar elevation={2} className={classes.appBar}>
      <Toolbar component="nav" variant="dense" className={classes.toolBar}>
        <TitleText value={props.title} />
        <TitleTextWithLink value="Sign in" to="/" />
        <DropdownButton options={props.options} icon={<AccountCircleIcon />} />
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
