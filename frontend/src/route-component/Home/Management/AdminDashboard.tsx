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
import { useHistory } from "react-router-dom";
import { AuthorizationContainer } from "../../../container-components/Authorization/AuthorizationContainer";
import NavigationBar from "../../../presentational-components/NavigationBar";
import { TitleText } from "../../../presentational-components/Text";
import {
  ALL_NAMESPACES_QUERY,
  ALL_USER_QUERY,
} from "../../../service-component/API/query";
import { GQLQuery } from "../../../schemaTypes";
import { useQuery } from "@apollo/client";
import { Toast } from "../../../presentational-components/Toast";
import {
  NamespaceDeleteDialog,
  NamespaceInputDialog,
  PersistentVolumeDeleteDialog,
  PersistentVolumeInputDialog,
  UserDeleteDialog,
  UserInputDialog,
} from "../../../presentational-components/FormDialog";
import { ALL_PV_QUERY } from "../../../service-component/API/mutation";

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

export default function AdminDashboard() {
  const classes = useStyles();
  const history = useHistory();
  const navigationBarFunction = [
    <MenuItem onClick={() => history.push("/home")}>Home</MenuItem>,
    <MenuItem onClick={() => history.push("/signout")}>Sign Out</MenuItem>,
  ];

  const userQuery = useQuery<GQLQuery>(ALL_USER_QUERY, {
    pollInterval: 30000,
  });

  const namespaceQuery = useQuery<GQLQuery>(ALL_NAMESPACES_QUERY, {
    pollInterval: 30000,
  });

  const pvQuery = useQuery<GQLQuery>(ALL_PV_QUERY, {
    pollInterval: 30000,
  });

  return (
    <AuthorizationContainer requireAdmin={true}>
      <div className={classes.root}>
        <NavigationBar
          options={navigationBarFunction}
          title="HCMIU Thesis Management System"
        />
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Box className={classes.box} style={{ flexDirection: "column" }}>
            <Container
              maxWidth="md"
              disableGutters={true}
              className={classes.container}
            >
              <Box className={classes.box}>
                <TitleText value="Users" />
                <Toast
                  label="Reload table"
                  message="Reloaded user table"
                  onClick={userQuery.refetch}
                />
              </Box>
              {userQuery.loading ? (
                <div>Loading users...</div>
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
                          <strong>ID</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Username</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Role</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Thesis ID</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Thesis Namespace</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userQuery.data &&
                        userQuery.data.allUsers &&
                        userQuery.data?.allUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell component="th" scope="row">
                              {user.id}
                            </TableCell>
                            <TableCell align="right">{user.username}</TableCell>
                            <TableCell align="right">{user.name}</TableCell>
                            <TableCell align="right">
                              {user.role?.name || "N/A"}
                            </TableCell>
                            <TableCell align="right">
                              {user.thesis?.id || "N/A"}
                            </TableCell>
                            <TableCell align="right">
                              {user.thesis?.namespace.name || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Box className={classes.box}>
                <UserDeleteDialog
                  onClose={() => {
                    setTimeout(userQuery.refetch, 2000);
                  }}
                />
                <UserInputDialog
                  onClose={() => {
                    setTimeout(userQuery.refetch, 2000);
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
                <TitleText value="Namespace" />
                <Toast
                  label="Reload table"
                  message="Reloaded namespace table"
                  onClick={namespaceQuery.refetch}
                />
              </Box>
              {namespaceQuery.loading ? (
                <div>Loading namespaces...</div>
              ) : (
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="Namespace information table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Namespace</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>No. of Deployments</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>No. of Services</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>No. of running Pods</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {namespaceQuery.data &&
                        namespaceQuery.data.allNamespaces &&
                        namespaceQuery.data?.allNamespaces.map((namespace) => (
                          <TableRow key={namespace.name}>
                            <TableCell component="th" scope="row">
                              {namespace.name}
                            </TableCell>
                            <TableCell align="right">
                              {namespace.deployments?.length || "0"}
                            </TableCell>
                            <TableCell align="right">
                              {namespace.services?.length || "0"}
                            </TableCell>
                            <TableCell align="right">
                              {namespace.pods?.length || "0"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Box className={classes.box}>
                <NamespaceDeleteDialog
                  onClose={() => {
                    setTimeout(namespaceQuery.refetch, 2000);
                  }}
                />
                <NamespaceInputDialog
                  onClose={() => {
                    setTimeout(namespaceQuery.refetch, 2000);
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
                <TitleText value="Storage / Persistent Volumes" />
                <Toast
                  label="Reload table"
                  message="Reloaded storage table"
                  onClick={pvQuery.refetch}
                />
              </Box>
              {pvQuery.loading ? (
                <div>Loading persistent volumes...</div>
              ) : (
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="Storage information table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Volume Name</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Capacity</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Volume Mode</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Access Modes</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Reclaim Policy</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pvQuery.data &&
                        pvQuery.data.allPersistentVolumes &&
                        pvQuery.data?.allPersistentVolumes.map((pv) => (
                          <TableRow key={pv.meta.name}>
                            <TableCell component="th" scope="row">
                              {pv.meta.name}
                            </TableCell>
                            <TableCell align="right">
                              {pv.capacity || "N/A"}
                            </TableCell>
                            <TableCell align="right">
                              {pv.volumeMode || "N/A"}
                            </TableCell>
                            <TableCell align="right">
                              {pv.accessMode.join("; ") || "N/A"}
                            </TableCell>
                            <TableCell align="right">
                              {pv.reclaimPolicy || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Box className={classes.box}>
                <PersistentVolumeDeleteDialog
                  onClose={() => {
                    setTimeout(pvQuery.refetch, 2000);
                  }}
                />
                <PersistentVolumeInputDialog
                  onClose={() => {
                    setTimeout(pvQuery.refetch, 2000);
                  }}
                />
              </Box>
            </Container>
          </Box>
        </div>
      </div>
    </AuthorizationContainer>
  );
}
