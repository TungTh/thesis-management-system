import gql from "graphql-tag";

export const SIGNIN_MUTATION = gql`
     mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            user {
                id
                username
                role {
                    name
                }
            }
        }
     }   
     `;

export const SIGNUP_MUTATION = gql`
    mutation signup($user: UserInput!) {
        signup(user: $user) {
            token
        }
    }
`;

export const DELETE_USER_MUTATION = gql`
mutation deleteUser ($id: String!) {
    deleteUser(id: $id)
}
`

export const SIGNOUT_MUTATION = gql`
	mutation logout {
		logout
	}
`;

export const REFRESHJWT_MUTATION = gql`
     mutation refreshJWT {
          refreshJWT {
               token
               user {
                    id
                    username
                    role {
                         name
                    }
               }
          }
     }
`;

export const CREATE_NAMESPACE_MUTATION = gql`
mutation createNamespace ($name: String!) {
    createNamespace (name: $name) {
        name
    }
}
`