import { Button, Snackbar } from "@material-ui/core";
import { FC, useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";

interface ToastProps {
  label: string;
  message: string;
  variant?: "success" | "error" | "warning" | "info";
  onClick: () => void;
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Toast: FC<ToastProps> = ({
  label,
  message,
  variant = "info",
  onClick,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setOpen(true);
          onClick();
        }}
      >
        {label}
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={variant}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
