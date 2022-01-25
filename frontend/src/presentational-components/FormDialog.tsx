import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
} from "@material-ui/core";
import { FC, useState } from "react";
// @ts-ignore
import FileBase64 from "react-file-base64";
import { GQLMutation, GQLThesis } from "../schemaTypes";
import {
  CREATE_CONFIGMAP_MUTATION,
  CREATE_DEPLOYMENT_MUTATION,
  CREATE_NAMESPACE_MUTATION,
  CREATE_PVC_MUTATION,
  CREATE_PV_MUTATION,
  CREATE_SECRET_MUTATION,
  CREATE_SERVICE_MUTATION,
  CREATE_THESIS_MUTATION,
  DELETE_CONFIGMAP_MUTATION,
  DELETE_DEPLOYMENT_MUTATION,
  DELETE_NAMESPACE_MUTATION,
  DELETE_PVC_MUTATION,
  DELETE_PV_MUTATION,
  DELETE_SECRET_MUTATION,
  DELETE_SERVICE_MUTATION,
  DELETE_USER_MUTATION,
  SIGNUP_MUTATION,
  UPDATE_THESIS_MUTATION,
} from "../service-component/API/mutation";
import { PasswordInput, TextInput } from "./Input";
import { Text } from "./Text";

interface DialogProps {
  onClose?: () => void;
}

export const UserInputDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    username: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });

  const [signup] = useMutation<GQLMutation>(SIGNUP_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    if (formInfo.password !== formInfo.passwordConfirm) {
      alert("Passwords do not match");
      return false;
    }
    signup({
      variables: {
        user: {
          username: formInfo.username,
          name: formInfo.name,
          password: formInfo.password,
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          username: "",
          name: "",
          password: "",
          passwordConfirm: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New User
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New User Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new user.
          </DialogContentText>
          <TextInput
            label="Username"
            id="username"
            value={formInfo.username}
            onChange={handleFormChange("username")}
          />
          <TextInput
            label="Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
          <PasswordInput
            label="Password"
            id="password"
            value={formInfo.password}
            onChange={handleFormChange("password")}
          />
          <PasswordInput
            label="Confirm Password"
            id="passwordConfirm"
            value={formInfo.passwordConfirm}
            onChange={handleFormChange("passwordConfirm")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const UserDeleteDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    userID: "",
  });

  const [deleteUser] = useMutation<GQLMutation>(DELETE_USER_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deleteUser({
      variables: {
        id: formInfo.userID,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          userID: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete User
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete User Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a user.
          </DialogContentText>
          <TextInput
            label="User ID"
            id="userID"
            value={formInfo.userID}
            onChange={handleFormChange("userID")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const NamespaceInputDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [createNamespace] = useMutation<GQLMutation>(CREATE_NAMESPACE_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createNamespace({
      variables: {
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Namespace
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Namespace Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new namespace.
          </DialogContentText>
          <TextInput
            label="Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const NamespaceDeleteDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deleteNamespace] = useMutation<GQLMutation>(DELETE_NAMESPACE_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deleteNamespace({
      variables: {
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete Namespace
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Namespace Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a namespace.
          </DialogContentText>
          <TextInput
            label="Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const PersistentVolumeInputDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
    capacity: "",
    volumeMode: "Filesystem",
    accessMode: ["ReadWriteOnce"],
    reclaimPolicy: "Retain",
  });

  const [createPersistentVolume] = useMutation<GQLMutation>(CREATE_PV_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createPersistentVolume({
      variables: {
        persistentVolume: {
          meta: {
            name: formInfo.name,
          },
          capacity: formInfo.capacity,
          volumeMode: formInfo.volumeMode,
          accessMode: formInfo.accessMode,
          reclaimPolicy: formInfo.reclaimPolicy,
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
          capacity: "",
          volumeMode: "Filesystem",
          accessMode: ["ReadWriteOnce"],
          reclaimPolicy: "Retain",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Persistent Volume
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          New Persistent Volume Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new persistent
            volume.
          </DialogContentText>
          <TextInput
            label="Volume Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
          <TextInput
            label="Volume Capacity"
            id="capacity"
            value={formInfo.capacity}
            onChange={handleFormChange("capacity")}
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Reclaim Policy</FormLabel>
            <RadioGroup
              aria-label="reclaimPolicy"
              name="reclaimPolicy"
              value={formInfo.reclaimPolicy}
              onChange={handleFormChange("reclaimPolicy")}
            >
              <FormControlLabel
                value="Retain"
                control={<Radio />}
                label="Retain"
              />
              <FormControlLabel
                value="Delete"
                control={<Radio />}
                label="Delete"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const PersistentVolumeDeleteDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deletePersistentVolume] = useMutation<GQLMutation>(DELETE_PV_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deletePersistentVolume({
      variables: {
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete Persistent Volume
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Delete Persistent Volume Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a persistent
            volume.
          </DialogContentText>
          <TextInput
            label="Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ThesisInputDialog: FC<DialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    title: "",
    studentName: "",
    studentID: "",
    supervisorName: "",
    semester: "",
    summary: "",
    report: "",
    namespace: "",
    tags: "",
  });

  const [createThesis] = useMutation<GQLMutation>(CREATE_THESIS_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleFileUpload = (file: any) => {
    const base64 = file.base64.split(",")[1];

    console.log(base64);

    setFormInfo({ ...formInfo, report: base64 });
  };

  const handleSubmit = () => {
    createThesis({
      variables: {
        thesis: {
          title: formInfo.title,
          studentName: formInfo.studentName,
          studentID: formInfo.studentID,
          supervisorName: formInfo.supervisorName,
          semester: formInfo.semester,
          summary: formInfo.summary,
          report: formInfo.report,
          namespace: formInfo.namespace,
          tags: formInfo.tags.split(",").map((tag) => ({
            name: tag.trim(),
          })),
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          title: "",
          studentName: "",
          studentID: "",
          supervisorName: "",
          semester: "",
          summary: "",
          report: "",
          namespace: "",
          tags: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Thesis
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">New Thesis Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new thesis.
          </DialogContentText>
          <Grid
            container
            component={Box}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Supervisor Name"
                id="supervisorName"
                value={formInfo.supervisorName}
                onChange={handleFormChange("supervisorName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Semester"
                id="sem"
                value={formInfo.semester}
                onChange={handleFormChange("semester")}
              />
            </Grid>
            <Grid item xs={12} lg={3} />
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Student Name"
                id="sname"
                value={formInfo.studentName}
                onChange={handleFormChange("studentName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Student ID"
                id="sid"
                value={formInfo.studentID}
                onChange={handleFormChange("studentID")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              lg={3}
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <FileBase64 onDone={handleFileUpload} />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                props={{ multiline: true }}
                label="Thesis Title"
                id="title"
                value={formInfo.title}
                onChange={handleFormChange("title")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                props={{ multiline: true, rows: "4" }}
                label="Summary"
                id="summary"
                value={formInfo.summary}
                onChange={handleFormChange("summary")}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Namespace"
                id="namespace"
                value={formInfo.namespace}
                onChange={handleFormChange("namespace")}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Tags (Comma Separated)"
                id="name"
                value={formInfo.tags}
                onChange={handleFormChange("tags")}
              />
            </Grid>
            <Grid item xs={12} lg={2} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface ThesisEditDialogProps extends DialogProps {
  thesis: GQLThesis;
}

export const ThesisEditDialog: FC<ThesisEditDialogProps> = ({
  onClose,
  thesis,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    title: thesis.title,
    studentName: thesis.studentName,
    studentID: thesis.studentID,
    supervisorName: thesis.supervisorName,
    semester: thesis.semester,
    summary: thesis.summary,
    report: thesis.report,
    namespace: thesis.namespace.name,
    tags: thesis.tags?.map((tag) => tag.name).join(", ") || "",
  });

  const [updateThesis] = useMutation<GQLMutation>(UPDATE_THESIS_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleFileUpload = (file: any) => {
    const base64 = file.base64.split(",")[1];

    console.log(base64);

    setFormInfo({ ...formInfo, report: base64 });
  };

  const handleSubmit = () => {
    updateThesis({
      variables: {
        id: thesis.id,
        thesis: {
          title: formInfo.title,
          studentName: formInfo.studentName,
          studentID: formInfo.studentID,
          supervisorName: formInfo.supervisorName,
          semester: formInfo.semester,
          summary: formInfo.summary,
          report: formInfo.report,
          namespace: formInfo.namespace,
          tags: formInfo.tags.split(",").map((tag) => ({
            name: tag.trim(),
          })),
        },
      },
    })
      .then((updateThesisResult) => {
        thesis = updateThesisResult.data?.updateThesis ?? thesis;
        console.log({ thesis });
        setOpen(false);
        setFormInfo({
          title: thesis.title,
          studentName: thesis.studentName,
          studentID: thesis.studentID,
          supervisorName: thesis.supervisorName,
          semester: thesis.semester,
          summary: thesis.summary,
          report: thesis.report,
          namespace: thesis.namespace.name,
          tags: thesis.tags?.map((tag) => tag.name).join(", ") || "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Edit Thesis
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">Thesis Update Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to update the thesis.
          </DialogContentText>
          <Grid
            container
            component={Box}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Supervisor Name"
                id="supervisorName"
                value={formInfo.supervisorName}
                onChange={handleFormChange("supervisorName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Semester"
                id="sem"
                value={formInfo.semester}
                onChange={handleFormChange("semester")}
              />
            </Grid>
            <Grid item xs={12} lg={3} />
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Student Name"
                id="sname"
                value={formInfo.studentName}
                onChange={handleFormChange("studentName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Student ID"
                id="sid"
                value={formInfo.studentID}
                onChange={handleFormChange("studentID")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              lg={3}
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Text value="Upload Report (Optional)" />
              <FileBase64 onDone={handleFileUpload} />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                props={{ multiline: true }}
                label="Thesis Title"
                id="title"
                value={formInfo.title}
                onChange={handleFormChange("title")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                props={{ multiline: true, rows: "4" }}
                label="Summary"
                id="summary"
                value={formInfo.summary}
                onChange={handleFormChange("summary")}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Namespace"
                id="namespace"
                value={formInfo.namespace}
                onChange={handleFormChange("namespace")}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Tags (Comma Separated)"
                id="name"
                value={formInfo.tags}
                onChange={handleFormChange("tags")}
              />
            </Grid>
            <Grid item xs={12} lg={2} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
interface NamespacedDialogProps extends DialogProps {
  namespace: string;
}

export const DeploymentInputDialog: FC<NamespacedDialogProps> = ({
  onClose,
  namespace,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
    containerName: "",
    containerImage: "",
    containerPort: "",
    portProtocol: "TCP",
    cpuLimit: "",
    memoryLimit: "",
    persistentVolumeClaim: "",
  });

  const [createDeployment] = useMutation<GQLMutation>(
    CREATE_DEPLOYMENT_MUTATION
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createDeployment({
      variables: {
        namespace: namespace,
        deployment: {
          name: formInfo.name,
          replicas: 0,
          template: {
            containers: [
              {
                name: formInfo.containerName,
                image: formInfo.containerImage,
                resources: {
                  limits: {
                    cpu: formInfo.cpuLimit,
                    memory: formInfo.memoryLimit,
                  },
                  requests: {
                    cpu: formInfo.cpuLimit,
                    memory: formInfo.memoryLimit,
                  },
                },
                ports: [
                  {
                    containerPort: parseInt(formInfo.containerPort),
                    protocol: formInfo.portProtocol,
                  },
                ],
                // env: [{}],
              },
            ],
          },
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
          containerName: "",
          containerImage: "",
          containerPort: "",
          portProtocol: "",
          cpuLimit: "",
          memoryLimit: "",
          persistentVolumeClaim: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Deployment
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">New Deployment Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new deployment.
          </DialogContentText>
          <Grid
            container
            component={Box}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Deployment Name"
                id="dplName"
                value={formInfo.name}
                onChange={handleFormChange("name")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Container Port"
                id="containerPort"
                value={formInfo.containerPort}
                onChange={handleFormChange("containerPort")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel id="port-protocol-select-label">
                  Port Protocol
                </InputLabel>
                <Select
                  labelId="port-protocol-select-label"
                  id="port-protocol-select"
                  value={formInfo.portProtocol}
                  onChange={handleFormChange("portProtocol")}
                >
                  <MenuItem value={"TCP"}>TCP</MenuItem>
                  <MenuItem value={"UDP"}>UDP</MenuItem>
                  <MenuItem value={"SCTP"}>SCTP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Container Name"
                id="containerName"
                value={formInfo.containerName}
                onChange={handleFormChange("containerName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Container Image"
                id="containerImage"
                value={formInfo.containerImage}
                onChange={handleFormChange("containerImage")}
              />
            </Grid>
            <Grid item xs={12} lg={3} />
            <Grid item xs={12} lg={4}>
              <TextInput
                props={{ required: false }}
                label="Persistent Volume Claim"
                id="persistentVolumeClaim"
                value={formInfo.persistentVolumeClaim}
                onChange={handleFormChange("persistentVolumeClaim")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <Tooltip title="Can also use Mi for millicpus, e.g 0.5 = 500Mi">
                <TextInput
                  label="CPU Limit (No. of cores, e.g 0.5 or 500Mi)"
                  id="cpuLimit"
                  value={formInfo.cpuLimit}
                  onChange={handleFormChange("cpuLimit")}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Memory Limit (RAM usage, e.g 1Gi or 500Mi)"
                id="memoryLimit"
                value={formInfo.memoryLimit}
                onChange={handleFormChange("memoryLimit")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const DeploymentDeleteDialog: FC<NamespacedDialogProps> = ({
  namespace,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deleteDeployment] = useMutation<GQLMutation>(
    DELETE_DEPLOYMENT_MUTATION
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deleteDeployment({
      variables: {
        namespace: namespace,
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete Deployment
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Deployment Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a deployment.
          </DialogContentText>
          <TextInput
            label="Deployment Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const SecretInputDialog: FC<NamespacedDialogProps> = ({
  onClose,
  namespace,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
    type: "Opaque",
    data: "",
  });

  const [createSecret] = useMutation<GQLMutation>(CREATE_SECRET_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createSecret({
      variables: {
        namespace,
        secret: {
          name: formInfo.name,
          type: formInfo.type,
          data: formInfo.data.split(",").map((item) => {
            item = item.trim();
            const keyPair = item.split("=");
            return {
              key: keyPair[0],
              value: keyPair[1],
            };
          }),
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
          type: "Opaque",
          data: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Secret
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Secret Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new secret.
          </DialogContentText>
          <TextInput
            label="Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
          <TextInput
            label="Secret Data (Comma Separated Key=Value Pairs, e.g 'foo=bar,baz=qux')"
            id="data"
            value={formInfo.data}
            onChange={handleFormChange("data")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const SecretDeleteDialog: FC<NamespacedDialogProps> = ({
  namespace,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deleteSecret] = useMutation<GQLMutation>(DELETE_SECRET_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deleteSecret({
      variables: {
        namespace: namespace,
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete Secret
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Secret Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a secret.
          </DialogContentText>
          <TextInput
            label="Secret Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ConfigMapInputDialog: FC<NamespacedDialogProps> = ({
  onClose,
  namespace,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
    data: "",
  });

  const [createConfigMap] = useMutation<GQLMutation>(CREATE_CONFIGMAP_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createConfigMap({
      variables: {
        namespace,
        configMap: {
          name: formInfo.name,
          data: formInfo.data.split(",").map((item) => {
            item = item.trim();
            const keyPair = item.split("=");
            return {
              key: keyPair[0],
              value: keyPair[1],
            };
          }),
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
          data: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New ConfigMap
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New ConfigMap Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new ConfigMap.
          </DialogContentText>
          <TextInput
            label="Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
          <TextInput
            label="Config Data (Comma Separated Key=Value Pairs, e.g 'foo=bar,baz=qux')"
            id="data"
            value={formInfo.data}
            onChange={handleFormChange("data")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ConfigMapDeleteDialog: FC<NamespacedDialogProps> = ({
  namespace,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deleteConfigMap] = useMutation<GQLMutation>(DELETE_CONFIGMAP_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deleteConfigMap({
      variables: {
        namespace: namespace,
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete ConfigMap
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete ConfigMap Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a config map.
          </DialogContentText>
          <TextInput
            label="ConfigMap Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const PersistentVolumeClaimInputDialog: FC<NamespacedDialogProps> = ({
  onClose,
  namespace,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
    volumeName: "",
    mode: "Filesystem",
    accessMode: "ReadWriteOnce",
    capacity: "",
  });

  const [createPVC] = useMutation<GQLMutation>(CREATE_PVC_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createPVC({
      variables: {
        namespace,
        persistentVolumeClaim: {
          meta: {
            name: formInfo.name,
          },
          volumeName: formInfo.volumeName,
          volumeMode: formInfo.mode,
          accessMode: formInfo.accessMode,
          resources: {
            requests: {
              storage: formInfo.capacity,
            },
          },
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
          volumeName: "",
          mode: "Filesystem",
          accessMode: "ReadWriteOnce",
          capacity: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Volume Claim
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          New Persistent Volume Claim Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new volume claim.
          </DialogContentText>
          <TextInput
            label="Claim Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
          <TextInput
            label="Volume Name"
            id="volumeName"
            value={formInfo.volumeName}
            onChange={handleFormChange("volumeName")}
          />
          <TextInput
            label="Capacity (e.g '1Gi')"
            id="capacity"
            value={formInfo.capacity}
            onChange={handleFormChange("capacity")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const PersistentVolumeClaimDeleteDialog: FC<NamespacedDialogProps> = ({
  namespace,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deletePVC] = useMutation<GQLMutation>(DELETE_PVC_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deletePVC({
      variables: {
        namespace: namespace,
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete Volume Claim
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Delete Persistent Volume Claim Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a PVC.
          </DialogContentText>
          <TextInput
            label="Claim Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ServiceInputDialog: FC<NamespacedDialogProps> = ({
  onClose,
  namespace,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
    dplName: "",
    type: "ClusterIP",
    portName: "",
    portProtocol: "TCP",
    port: "",
  });

  const [createService] = useMutation<GQLMutation>(CREATE_SERVICE_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    createService({
      variables: {
        namespace: namespace,
        service: {
          name: formInfo.name,
          dplName: formInfo.dplName,
          type: formInfo.type,
          ports: [
            {
              name: formInfo.portName,
              protocol: formInfo.portProtocol,
              port: parseInt(formInfo.port),
              targetPort: parseInt(formInfo.port),
            },
          ],
        },
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
          dplName: "",
          type: "ClusterIP",
          portName: "",
          portProtocol: "TCP",
          port: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Service
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">New Service Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to create a new service.
          </DialogContentText>
          <Grid
            container
            component={Box}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={12} lg={4}>
              <TextInput
                label="Service Name"
                id="name"
                value={formInfo.name}
                onChange={handleFormChange("name")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Deployment Name"
                id="dplName"
                value={formInfo.dplName}
                onChange={handleFormChange("dplName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel id="port-protocol-select-label">Type</InputLabel>
                <Select
                  labelId="port-protocol-select-label"
                  id="port-protocol-select"
                  value={formInfo.type}
                  onChange={handleFormChange("type")}
                >
                  <MenuItem value={"ExternalName"}>ExternalName</MenuItem>
                  <MenuItem value={"ClusterIP"}>ClusterIP</MenuItem>
                  <MenuItem value={"NodePort"}>NodePort</MenuItem>
                  <MenuItem value={"LoadBalancer"}>LoadBalancer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                props={{ required: false }}
                label="Port Name"
                id="portName"
                value={formInfo.portName}
                onChange={handleFormChange("portName")}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel id="port-protocol-select-label">
                  Port Protocol
                </InputLabel>
                <Select
                  labelId="port-protocol-select-label"
                  id="port-protocol-select"
                  value={formInfo.portProtocol}
                  onChange={handleFormChange("portProtocol")}
                >
                  <MenuItem value={"TCP"}>TCP</MenuItem>
                  <MenuItem value={"UDP"}>UDP</MenuItem>
                  <MenuItem value={"SCTP"}>SCTP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextInput
                label="Port"
                id="port"
                value={formInfo.port}
                onChange={handleFormChange("port")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ServiceDeleteDialog: FC<NamespacedDialogProps> = ({
  namespace,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: "",
  });

  const [deleteService] = useMutation<GQLMutation>(DELETE_SERVICE_MUTATION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleFormChange =
    (prop: string) =>
    (event: { preventDefault: () => void; target: { value: any } }) => {
      event.preventDefault();
      setFormInfo({ ...formInfo, [prop]: event.target.value });
    };

  const handleSubmit = () => {
    deleteService({
      variables: {
        namespace: namespace,
        name: formInfo.name,
      },
    })
      .then(() => {
        setOpen(false);
        setFormInfo({
          name: "",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Delete Service
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Service Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to delete a service.
          </DialogContentText>
          <TextInput
            label="Service Name"
            id="name"
            value={formInfo.name}
            onChange={handleFormChange("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
