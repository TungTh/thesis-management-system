import React, { useContext, useEffect, FC, ReactElement } from "react";
import { AuthorizationContext } from "../../service-component/Context/authorization";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REFRESHJWT_MUTATION } from "../../service-component/API/mutation";

interface AuthorizationContainerProps {
  requireAdmin?: boolean;
  children: ReactElement<{}>;
}

export const AuthorizationContainer: FC<AuthorizationContainerProps> = ({
  children,
  requireAdmin,
}) => {
  const AuthContext = useContext(AuthorizationContext);
  const [refreshJWT] = useMutation(REFRESHJWT_MUTATION);

  useEffect(() => {
    const handleRefreshJWT = async () => {
      console.log("refreshJWT");
      try {
        const data = await refreshJWT();
        AuthContext.setAuthorization({
          status: true,
          token: data.data.refreshJWT.token,
          user: {
            id: data.data.refreshJWT.user.id,
            username: data.data.refreshJWT.user.username,
            role: {
              name: data.data.refreshJWT.user.role.name,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    (async () => {
      if (AuthContext.token != null) {
        const tokenPayload = AuthContext.token.split(".")[1];
        const tokenExpiration = new Date(tokenPayload);
        const now = new Date();
        if (tokenExpiration.getTime() - now.getTime() < 1000 * 60 * 5) {
          await handleRefreshJWT();
        }
      } else {
        await handleRefreshJWT();
      }
    })();
  }, [AuthContext, AuthContext.token, refreshJWT]);

  if (!AuthContext.status) return <Redirect to="/" />;

  console.log({ require: requireAdmin, user: AuthContext.user });

  if (requireAdmin && AuthContext.user.role.name !== "Admin")
    return <Redirect to="/" />;

  return children;
};
