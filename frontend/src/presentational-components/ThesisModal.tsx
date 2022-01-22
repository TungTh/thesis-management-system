import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import { FC, useState } from "react";
import { GQLThesis } from "../schemaTypes";
import { TextContent, TitleText } from "./Text";

interface ThesisModalProps {
  thesis: GQLThesis;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    display: "block",
    width: "80%",
    padding: theme.spacing(2, 4, 2),
    margin: "auto",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0),
  },
  innerPaper: {
    position: "relative",
    dipslay: "block",
    margin: "auto",
    marginLeft: theme.spacing(1),
  },
  container: {
    position: "absolute",
    display: "flex",
    margin: "auto",
  },
  box: {
    marginTop: "auto",
    display: "block",
    position: "relative",
  },
  card: {
    position: "relative",
    display: "flex",
    margin: theme.spacing(1, 6, 1, 6),
    backgroundColor: theme.palette.background.default,
  },
  cardContent: {
    padding: theme.spacing(0, 2, 0, 4),
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export const ThesisModal: FC<ThesisModalProps> = ({ thesis }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal open={open} onClose={handleClose}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          spacing={3}
          className={classes.container}
        >
          <Grid item component={Paper} className={classes.paper}>
            <Grid container direction="row" spacing={0}>
              <Grid item className={classes.innerPaper}>
                <TitleText value={thesis.title} />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                  className={classes.button}
                >
                  {"Back to list"}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  {"View Demo"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item component={Paper} className={classes.paper}>
            <Grid container direction="column" spacing={2} component={Box}>
              <Grid item component={Box} className={classes.box}>
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Thesis Owner"
                        value={thesis.studentName}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                      <TextContent
                        label="Thesis Owner"
                        value={thesis.studentName}
                      />
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    test
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    test
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    test
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    test
                  </Grid>
                </Grid>
              </Grid>
              <Grid item></Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
