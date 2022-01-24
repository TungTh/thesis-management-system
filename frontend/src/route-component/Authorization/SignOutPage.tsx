import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthorizationContainer } from "../../container-components/Authorization/AuthorizationContainer";
import { InformDialog } from "../../presentational-components/Dialog";
import { SIGNOUT_MUTATION } from "../../service-component/API/mutation";
import { AuthorizationContext } from "../../service-component/Context/authorization";

export default function SignOutPage() {
  const [signOut] = useMutation(SIGNOUT_MUTATION);
  const history = useHistory();
  const AuthContext = useContext(AuthorizationContext);

  const handleSignOut = () => {
    signOut()
      .then(() => {
        AuthContext.setAuthorization({
          status: false,
          token: "",
          user: {
            id: "",
            username: "",
            role: {
              name: "",
            },
          },
        });
      })
      .catch();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <AuthorizationContainer>
      <InformDialog
        open={true}
        information="Are you sure you want to sign out?"
        onContinue={handleSignOut}
        onCancel={handleCancel}
      />
    </AuthorizationContainer>
  );
}
