import { Card, colors } from "@material-ui/core";
import { Padding } from "@mui/icons-material";
import { FC } from "react";
import { stringToColor } from "../service-component/Others/stringToColor";

interface TagProps {
  tag: string;
}

export const Tag: FC<TagProps> = ({ tag }) => {
  return (
    <Card
      style={{
        backgroundColor: stringToColor(tag),
        color: "white",
        padding: "5px",
        display: "inline-flex",
      }}
    >
      {tag}
    </Card>
  );
};
