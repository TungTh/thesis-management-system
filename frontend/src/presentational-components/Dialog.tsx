import React, { FC } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CircularProgress from "@material-ui/core/CircularProgress";

interface DialogProps {
  open: boolean;
  error?: string;
  success?: string;
  information?: string;
  onClose?: () => void;
  onContinue?: () => void;
  onCancel?: () => void;
}

export const ErrorDialog: FC<DialogProps> = ({ error, open, onClose }) => {
  return (
    <div>
      <Dialog open={open} onClose={ onClose }>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ onClose } color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const LoadingDialog: FC<DialogProps> = ({ open }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent>
        <CircularProgress size={50} />
      </DialogContent>
    </Dialog>
  );
};

export const SuccessDialog: FC<DialogProps> = ({ success, open }) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
          <DialogContentText>{success}</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const InformDialog: FC<DialogProps> = ({
  open,
  information,
  onContinue,
  onCancel,
}) => {
  return (
    <div>
      <Dialog open={open} onClose={onCancel}>
        <DialogContent>
          <DialogContentText>{information}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={onContinue} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
