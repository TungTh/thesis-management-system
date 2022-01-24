import { useMutation } from "@apollo/client";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { FC, useState } from "react";
import { GQLMutation } from "../schemaTypes";
import {
  CREATE_NAMESPACE_MUTATION,
  CREATE_PV_MUTATION,
  DELETE_NAMESPACE_MUTATION,
  DELETE_PV_MUTATION,
  DELETE_USER_MUTATION,
  SIGNUP_MUTATION,
} from "../service-component/API/mutation";
import { PasswordInput, TextInput } from "./Input";

interface DialogProps {
  onClose: () => void;
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
    onClose();
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
    onClose();
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
    onClose();
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
    onClose();
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
    onClose();
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
    onClose();
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
