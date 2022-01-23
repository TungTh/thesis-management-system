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
  rowBox: {
    padding: theme.spacing(3, 5, 3, 5),
  },
  card: {
    position: "relative",
    display: "flex",
    margin: theme.spacing(2, 1, 2, 1),
    backgroundColor: theme.palette.background.default,
    width: "100%",
  },
  backgroundCard: {
    position: "relative",
    display: "flex",
    padding: theme.spacing(0, 0, 0, 0),
    backgroundColor: "#9ED7D5",
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
  modal: {
    maxHeight: "100vh",
    overflow: "auto",
  },
}));

export const ThesisModal: FC<ThesisModalProps> = ({ thesis }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let memoryUsage = "0";
  let cpuUsage = "0";
  if (thesis.namespace.deployments) {
    thesis.namespace.deployments.forEach((deployment) => {
      const mem = deployment.template.containers.map((container) => {
        return (
          (container.resources &&
            container.resources.limits &&
            container.resources.limits.memory) ||
          "Not defined"
        );
      });

      memoryUsage = mem.join(", ");

      const cpu = deployment.template.containers.map((container) => {
        return (
          (container.resources &&
            container.resources.limits &&
            container.resources.limits.cpu) ||
          "Not defined"
        );
      });

      cpuUsage = cpu.join(", ");
    });
  }

  let storageUsage = "0Gi";
  if (thesis.namespace.persistentVolumeClaims) {
    const storage = thesis.namespace.persistentVolumeClaims.map((pvc) => {
      return (
        (pvc.resources &&
          pvc.resources.requests &&
          pvc.resources.requests.storage) ||
        "Not defined"
      );
    });

    storageUsage = storage.join(", ");
  }

  return (
    <Container maxWidth="sm">
      <Card className={classes.backgroundCard}>
        <CardContent className={classes.cardContent}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Button onClick={handleOpen}>More</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          spacing={3}
          className={classes.container}
        >
          <Grid item component={Paper} className={classes.paper}>
            <Grid container direction="row" spacing={0}>
              <Grid item className={classes.innerPaper} xs={12} lg={8}>
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
                  {"👁 View Demo"}
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
                  className={classes.rowBox}
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
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Thesis Owner ID"
                        value={thesis.studentID}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Thesis Completion Semester"
                        value={thesis.semester}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Thesis Report"
                        value={thesis.studentID}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Keywords"
                        value={
                          thesis.tags?.reduce((keywords, tag) => {
                            return {
                              name: [keywords.name, tag.name].join(", "),
                            };
                          }).name || "None"
                        }
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Supervisor"
                        value={thesis.supervisorName}
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
                        label="Thesis Summary"
                        value={
                          thesis.summary ||
                          "*No summary was provided for this thesis*"
                        }
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
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="No. of Deployments"
                        value={
                          thesis.namespace.deployments?.length.toString() || "0"
                        }
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="No. of Services"
                        value={
                          thesis.namespace.services?.length.toString() || "0"
                        }
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="No. of running Pods"
                        value={thesis.namespace.pods?.length.toString() || "0"}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent
                        label="Memory Usage Limit"
                        value={memoryUsage}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent label="Storage Usage" value={storageUsage} />
                    </CardContent>
                  </Grid>
                  <Grid item component={Card} sm={3} className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <TextContent label="CPU Usage Limit" value={cpuUsage} />
                    </CardContent>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </Container>
  );
};
