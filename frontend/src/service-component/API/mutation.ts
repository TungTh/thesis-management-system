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

export const DELETE_NAMESPACE_MUTATION = gql`
mutation deleteNamespace ($name: String!) {
    deleteNamespace (name: $name)
}
`

export const ALL_PV_QUERY = gql`
query allPersistentVolumes {
    allPersistentVolumes {
        meta {
            name
        }
        capacity
        volumeMode
        accessMode
        reclaimPolicy
    }
}
`

export const CREATE_PV_MUTATION = gql`
mutation createPersistentVolume ($persistentVolume: PersistentVolumeInput!) {
    createPersistentVolume (persistentVolume: $persistentVolume) {
        meta {
            name
        }
        accessMode
        volumeMode
        capacity
        reclaimPolicy
    }
}
`

export const DELETE_PV_MUTATION = gql`
mutation deletePersistentVolume ($name: String!) {
    deletePersistentVolume (name: $name)
}
`