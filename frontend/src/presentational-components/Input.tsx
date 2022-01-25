import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

interface InputProps {
  label: string;
  value?: string;
  id: string;
  size?: "small" | "medium";
  type?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onEnter?: () => void;
  choices?: {
    key: string;
    value: string;
  }[];
  props?: { [key: string]: any };
}

export const TextInput: FC<InputProps> = ({
  size,
  label,
  id,
  value,
  onChange,
  props,
}) => {
  return (
    <TextField
      {...props}
      required
      fullWidth
      autoFocus
      variant="outlined"
      margin="normal"
      size={size}
      id={id}
      label={label}
      name={id}
      value={value}
      onChange={(event) => onChange(event)}
    />
  );
};

export const PasswordInput: FC<InputProps> = ({
  label,
  id,
  value,
  onChange,
  onEnter,
}) => {
  return (
    <TextField
      required
      fullWidth
      autoFocus
      variant="outlined"
      margin="normal"
      type="password"
      id={id}
      label={label}
      name={id}
      value={value}
      onChange={(event) => onChange(event)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onEnter && onEnter();
        }
      }}
    />
  );
};

export const SelectInput: FC<InputProps> = ({ label, id, choices }) => {
  return (
    <Select required fullWidth variant="outlined" id={id} label={label}>
      {choices &&
        choices.map((choice) => {
          return (
            <MenuItem key={choice.key} value={choice.value}>
              {choice}
            </MenuItem>
          );
        })}
    </Select>
  );
};
