import { Avatar } from "@material-ui/core";
import { FC } from "react";
import { stringToColor } from "../service-component/Others/stringToColor";

function stringAvatar(name: string) {
  return {
    style: {
      backgroundColor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

interface BackgroundLetterAvatarsProps {
  str: string;
}

export const BackgroundLetterAvatars: FC<BackgroundLetterAvatarsProps> = ({
  str,
}) => {
  return <Avatar {...stringAvatar(str)} />;
};
