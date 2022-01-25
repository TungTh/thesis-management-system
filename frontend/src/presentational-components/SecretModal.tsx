import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Modal,
  Paper,
  Theme,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FC, useState } from "react";
import { GQLSecret } from "../schemaTypes";
import { TextContent } from "./Text";

interface SecretModalProps {
  secret: GQLSecret;
}

const useStyles = makeStyles((theme: Theme) => ({
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
    display: "flex",
    position: "relative",
  },
  rowBox: {
    padding: theme.spacing(3, 5, 3, 5),
  },
  card: {
    position: "relative",
    display: "flex",
    margin: theme.spacing(2, 1, 2, 1),
    backgroundColor: theme.palette.background.default,
    width: "100%",
    overflowX: "hidden",
  },
  backgroundCard: {
    position: "relative",
    display: "flex",
    padding: theme.spacing(0, 0, 0, 0),
    backgroundColor: "#9ED7D5",
    flexDirection: "column",
    borderRadius: theme.spacing(2),
  },
  cardOverlay: {
    width: "100%",
    padding: theme.spacing(0, 0, 0, 0),
  },
  cardOverlayTransparent: {
    width: "100%",
    padding: theme.spacing(0, 0, 0, 0),
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  cardContentOverlay: {
    width: "100%",
    padding: theme.spacing(0, 0, 0, 0),
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  cardContent: {
    padding: theme.spacing(0, 2, 0, 4),
    width: "100%",
    overflowX: "hidden",
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  cardContentBalance: {
    padding: theme.spacing(1, 3, 1, 3),
    justifyContent: "center",
    display: "flex",
  },
  button: {
    margin: theme.spacing(1),
  },
  modal: {
    maxHeight: "100vh",
    overflow: "auto",
  },
}));

export const SecretModal: FC<SecretModalProps> = ({ secret }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="sm">
      <Button
        onClick={handleOpen}
        style={{ color: "#6200EE", fontWeight: "bold" }}
      >
        More
      </Button>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          spacing={3}
          className={classes.container}
        >
          <Grid item component={Paper} className={classes.paper}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              className={classes.button}
            >
              {"Back to list"}
            </Button>
          </Grid>
          <Grid item component={Paper} className={classes.paper}>
            <Grid container direction="column" spacing={2} component={Box}>
              <Grid item component={Box} className={classes.box}>
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  className={classes.rowBox}
                >
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent label="Name" value={secret.meta.name} />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Namespace"
                        value={secret.meta.namespace?.name || "N/A"}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="No. of Key-Pair values"
                        value={secret.data?.length.toString() || "N/A"}
                      />
                    </CardContent>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  className={classes.rowBox}
                >
                  <Grid item component={Card} xs={12} className={classes.card}>
                    <CardContent>
                      <TextContent
                        label="Secret YAML"
                        value={<code>{secret.yaml}</code>}
                      />
                    </CardContent>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </Container>
  );
};
