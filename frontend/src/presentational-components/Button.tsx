import React, { FC } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import Paper from "@material-ui/core/Paper";

interface ButtonProps {
  icon?: JSX.Element;
  options?: JSX.Element[];
  value?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ActionButton: FC<ButtonProps> = ({ value, onClick }) => {
  return (
    <Button
      fullWidth
      disableElevation
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      {value}
    </Button>
  );
};

export const IconActionButton: FC<ButtonProps> = ({
  disabled,
  icon,
  onClick,
}) => {
  return (
    <IconButton disabled={disabled} color="primary" onClick={onClick}>
      {icon}
    </IconButton>
  );
};

export const DropdownButton: FC<ButtonProps> = ({ options, icon }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: React.ChangeEvent<any>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Paper elevation={0}>
      <IconButton color="inherit" aria-haspopup="true" onClick={handleClick}>
        {icon}
      </IconButton>
      <Paper
        elevation={0}
        style={{ margin: "0px", border: "1px solid black" }}
      />
      <Menu
        keepMounted
        elevation={2}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options &&
          options.map((option) => {
            return option;
          })}
      </Menu>
    </Paper>
  );
};
