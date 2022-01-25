import { useQuery } from "@apollo/client";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { AuthorizationContainer } from "../../../container-components/Authorization/AuthorizationContainer";
import { ConfigMapModal } from "../../../presentational-components/ConfigMapModal";
import { DeploymentModal } from "../../../presentational-components/DeploymentModal";
import { LoadingDialog } from "../../../presentational-components/Dialog";
import {
  ConfigMapDeleteDialog,
  ConfigMapInputDialog,
  DeploymentDeleteDialog,
  DeploymentInputDialog,
  PersistentVolumeClaimDeleteDialog,
  PersistentVolumeClaimInputDialog,
  SecretDeleteDialog,
  SecretInputDialog,
  ServiceDeleteDialog,
  ServiceInputDialog,
  ThesisEditDialog,
  ThesisInputDialog,
  UserDeleteDialog,
  UserInputDialog,
} from "../../../presentational-components/FormDialog";
import NavigationBar from "../../../presentational-components/NavigationBar";
import { SecretModal } from "../../../presentational-components/SecretModal";
import { ServiceModal } from "../../../presentational-components/ServiceModal";
import { TitleText } from "../../../presentational-components/Text";
import { Toast } from "../../../presentational-components/Toast";
import { GQLQuery, GQLServicePort } from "../../../schemaTypes";
import { USER_BY_ID_QUERY } from "../../../service-component/API/query";
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
    width: "100%",
    justifyContent: "space-between",
  },
  container: {
    width: "100%",
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const AuthContext = useContext(AuthorizationContext);
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/home")}>Home</MenuItem>,
    <MenuItem onClick={() => history.push("/signout")}>Sign Out</MenuItem>,
  ];

  const { user } = AuthContext;

  const query = useQuery<GQLQuery>(USER_BY_ID_QUERY, {
    variables: { id: user.id },
  });

  if (user.role.name === "Admin") return <Redirect to="/adminDashboard" />;

  return (
    <AuthorizationContainer>
      <div className={classes.root}>
        {query.loading ? (
          <LoadingDialog open={true} />
        ) : (
          <>
            <NavigationBar
              options={navigationBarFunction}
              title="HCMIU Thesis Management System"
            />
            <div className={classes.content}>
              <div className={classes.appBarSpacer} />
              {(() => {
                const namespace = query.data?.getUserById?.thesis?.namespace;

                if (!namespace) {
                  return (
                    <Box className={classes.box} flexDirection="column">
                      <Container className={classes.container}>
                        <Box
                          className={classes.box}
                          style={{ justifyContent: "center" }}
                        >
                          <TitleText value="Create a thesis below if you have a namespace." />
                        </Box>
                      </Container>
                      <Container className={classes.container}>
                        <Box
                          className={classes.box}
                          style={{ justifyContent: "center" }}
                        >
                          <TitleText value="Otherwise, contact an administrator to get a namespace." />
                        </Box>
                      </Container>
                      <Container className={classes.container}>
                        <Box
                          className={classes.box}
                          style={{ justifyContent: "center" }}
                        >
                          <ThesisInputDialog />
                        </Box>
                      </Container>
                    </Box>
                  );
                }
                return (
                  <Box className={classes.box} flexDirection="column">
                    <Container
                      maxWidth="md"
                      disableGutters={true}
                      className={classes.container}
                    >
                      {query.data?.getUserById?.thesis ? (
                        <ThesisEditDialog
                          thesis={query.data.getUserById.thesis}
                        />
                      ) : (
                        <>Something went wrong! You shouldn't see this</>
                      )}
                    </Container>
                    <Container
                      maxWidth="md"
                      disableGutters={true}
                      className={classes.container}
                    >
                      <Box className={classes.box}>
                        <TitleText value="Deployments" />
                        <Toast
                          label="Reload tables"
                          message="Reloaded all tables"
                          onClick={query.refetch}
                        />
                      </Box>
                      {query.loading ? (
                        <div>Loading resources...</div>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table
                            className={classes.table}
                            size="small"
                            aria-label="User information table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>Deployment Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Container Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Container Image</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>CPU Limit</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Memory Limit</strong>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>Extra Info</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {query.data?.getUserById?.thesis?.namespace
                                .deployments &&
                                query.data.getUserById.thesis.namespace.deployments.map(
                                  (dpl) => (
                                    <TableRow key={dpl.meta.name}>
                                      <TableCell component="th" scope="row">
                                        {dpl.meta.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {dpl.template.containers[0].name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {dpl.template.containers[0].image}
                                      </TableCell>
                                      <TableCell align="right">
                                        {dpl.template.containers[0].resources
                                          ?.limits?.cpu || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {dpl.template.containers[0].resources
                                          ?.limits?.memory || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {(() => {
                                          const newDpl = {
                                            ...dpl,
                                            meta: {
                                              name: dpl.meta.name,
                                              namespace: {
                                                name: namespace.name,
                                              },
                                            },
                                          };
                                          return (
                                            <DeploymentModal
                                              deployment={newDpl}
                                            />
                                          );
                                        })()}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      <Box className={classes.box}>
                        <DeploymentDeleteDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                        <DeploymentInputDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                      </Box>
                    </Container>
                    <Container
                      maxWidth="md"
                      disableGutters={true}
                      className={classes.container}
                    >
                      <Box className={classes.box}>
                        <TitleText value="Services" />
                        <Toast
                          label="Reload tables"
                          message="Reloaded all tables"
                          onClick={query.refetch}
                        />
                      </Box>
                      {query.loading ? (
                        <div>Loading resources...</div>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table
                            className={classes.table}
                            size="small"
                            aria-label="Service information table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>Service Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Deployment Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Service Type</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Open Ports</strong>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>Extra Info</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {query.data?.getUserById?.thesis?.namespace
                                .services &&
                                query.data.getUserById.thesis.namespace.services.map(
                                  (service) => (
                                    <TableRow key={service.meta.name}>
                                      <TableCell component="th" scope="row">
                                        {service.meta.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {service.dplName}
                                      </TableCell>
                                      <TableCell align="right">
                                        {service.type}
                                      </TableCell>
                                      <TableCell align="right">
                                        {service.ports
                                          ?.map(
                                            (port: GQLServicePort) =>
                                              `${port.protocol}:${port.name}:${port.port}`
                                          )
                                          .join(", ") || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {(() => {
                                          const newService = {
                                            ...service,
                                            meta: {
                                              name: service.meta.name,
                                              namespace: {
                                                name: namespace.name,
                                              },
                                            },
                                          };
                                          return (
                                            <ServiceModal
                                              service={newService}
                                            />
                                          );
                                        })()}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      <Box className={classes.box}>
                        <ServiceDeleteDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                        <ServiceInputDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                      </Box>
                    </Container>
                    <Container
                      maxWidth="md"
                      disableGutters={true}
                      className={classes.container}
                    >
                      <Box className={classes.box}>
                        <TitleText value="Secrets" />
                        <Toast
                          label="Reload tables"
                          message="Reloaded all tables"
                          onClick={query.refetch}
                        />
                      </Box>
                      {query.loading ? (
                        <div>Loading resources...</div>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table
                            className={classes.table}
                            size="small"
                            aria-label="Secret information table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>Secret Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Type</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>No. Of Key-Pair values</strong>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>Extra Info</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {query.data?.getUserById?.thesis?.namespace
                                .secrets &&
                                query.data.getUserById.thesis.namespace.secrets.map(
                                  (secret) => (
                                    <TableRow key={secret.meta.name}>
                                      <TableCell component="th" scope="row">
                                        {secret.meta.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {secret.type}
                                      </TableCell>
                                      <TableCell align="right">
                                        {secret.data?.length || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {(() => {
                                          const newSecret = {
                                            ...secret,
                                            meta: {
                                              name: secret.meta.name,
                                              namespace: {
                                                name: namespace.name,
                                              },
                                            },
                                          };
                                          return (
                                            <SecretModal secret={newSecret} />
                                          );
                                        })()}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      <Box className={classes.box}>
                        <SecretDeleteDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                        <SecretInputDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                      </Box>
                    </Container>
                    <Container
                      maxWidth="md"
                      disableGutters={true}
                      className={classes.container}
                    >
                      <Box className={classes.box}>
                        <TitleText value="Config Maps" />
                        <Toast
                          label="Reload tables"
                          message="Reloaded all tables"
                          onClick={query.refetch}
                        />
                      </Box>
                      {query.loading ? (
                        <div>Loading resources...</div>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table
                            className={classes.table}
                            size="small"
                            aria-label="Config Map information table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>ConfigMap Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>No. Of Key-Pair values</strong>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>Extra Info</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {query.data?.getUserById?.thesis?.namespace
                                .configMaps &&
                                query.data.getUserById.thesis.namespace.configMaps.map(
                                  (cfgMap) => (
                                    <TableRow key={cfgMap.meta.name}>
                                      <TableCell component="th" scope="row">
                                        {cfgMap.meta.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {cfgMap.data?.length || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {(() => {
                                          const newCfgMap = {
                                            ...cfgMap,
                                            meta: {
                                              name: cfgMap.meta.name,
                                              namespace: {
                                                name: namespace.name,
                                              },
                                            },
                                          };
                                          return (
                                            <ConfigMapModal
                                              configMap={newCfgMap}
                                            />
                                          );
                                        })()}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      <Box className={classes.box}>
                        <ConfigMapDeleteDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                        <ConfigMapInputDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                      </Box>
                    </Container>
                    <Container
                      maxWidth="md"
                      disableGutters={true}
                      className={classes.container}
                    >
                      <Box className={classes.box}>
                        <TitleText value="Persistent Volume Claims" />
                        <Toast
                          label="Reload tables"
                          message="Reloaded all tables"
                          onClick={query.refetch}
                        />
                      </Box>
                      {query.loading ? (
                        <div>Loading resources...</div>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table
                            className={classes.table}
                            size="small"
                            aria-label="PVC information table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>PVC Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Volume Name</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Volume Mode</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Access Mode</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Capacity</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {query.data?.getUserById?.thesis?.namespace
                                .persistentVolumeClaims &&
                                query.data.getUserById.thesis.namespace.persistentVolumeClaims.map(
                                  (pvc) => (
                                    <TableRow key={pvc.meta.name}>
                                      <TableCell component="th" scope="row">
                                        {pvc.meta.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {pvc.volumeName}
                                      </TableCell>
                                      <TableCell align="right">
                                        {pvc.volumeMode}
                                      </TableCell>
                                      <TableCell align="right">
                                        {pvc.accessMode || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {pvc.resources?.requests?.storage ||
                                          "N/A"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      <Box className={classes.box}>
                        <PersistentVolumeClaimDeleteDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                        <PersistentVolumeClaimInputDialog
                          namespace={namespace.name}
                          onClose={() => {
                            setTimeout(query.refetch, 2000);
                          }}
                        />
                      </Box>
                    </Container>
                  </Box>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </AuthorizationContainer>
  );
}
