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

export const CREATE_THESIS_MUTATION = gql`
mutation createThesis ($thesis: ThesisInput!) {
    createThesis (thesis: $thesis) {
        id
    }
}
`

export const UPDATE_THESIS_MUTATION = gql`
mutation updateThesis($id: String!, $thesis: ThesisInput!) {
    updateThesis(id: $id, thesis: $thesis) {
        id
        title
        studentName
        studentID
        supervisorName
        semester
        summary
        report
        namespace {
            name
        }
        tags {
            name
        }
    }
}
`

export const CREATE_DEPLOYMENT_MUTATION = gql`
mutation createDeployment ($namespace: String!, $deployment: DeploymentInput!) {
    createDeployment (namespace: $namespace, deployment: $deployment) {
        meta {
            name
            namespace {
                name
            }
        }
        template {
            containers {
                name
                image
                resources {
                    limits {
                        cpu
                        memory
                    }
                }
                ports {
                    containerPort
                    protocol
                }
                env {
                    name
                    value
                    valueFrom {
                        secretKeyRef {
                            name
                            key
                        }
                        configMapKeyRef {
                            name
                            key
                        }
                    }
                }
            }
            volumes {
                name
                persistentVolumeClaim 
            }
        }
        yaml
    }
}
`

export const DELETE_DEPLOYMENT_MUTATION = gql`
mutation deleteDeployment ($namespace: String!, $name: String!) {
    deleteDeployment (namespace: $namespace, name: $name)
}
`

export const CREATE_SECRET_MUTATION = gql`
mutation createSecret ($namespace: String!, $secret: SecretInput!) {
    createSecret (namespace: $namespace, secret: $secret) {
        meta {
            name
        }
        type
        data {
            key
            value
        }
        yaml
    }
}
`

export const DELETE_SECRET_MUTATION = gql`
mutation deleteSecret ($namespace: String!, $name: String!) {
    deleteSecret (namespace: $namespace, name: $name)
}
`

export const CREATE_CONFIGMAP_MUTATION = gql`
mutation createConfigMap ($namespace: String!, $configMap: ConfigMapInput!) {
    createConfigMap (namespace: $namespace, configMap: $configMap) {
        meta {
            name
        }
        data {
            key
            value
        }
        yaml
    }
}
`

export const DELETE_CONFIGMAP_MUTATION = gql`
mutation deleteConfigMap ($namespace: String!, $name: String!) {
    deleteConfigMap (namespace: $namespace, name: $name)
}
`

export const CREATE_PVC_MUTATION = gql`
mutation createPersistentVolumeClaim ($namespace: String!, $persistentVolumeClaim: PersistentVolumeClaimInput!) {
    createPersistentVolumeClaim (namespace: $namespace, persistentVolumeClaim: $persistentVolumeClaim) {
        meta {
            name
        }
        volumeName
        volumeMode
        accessMode
        resources {
            requests {
                storage
            }
        }
    }
}
`

export const DELETE_PVC_MUTATION = gql`
mutation deletePersistentVolumeClaim ($namespace: String!, $name: String!) {
    deletePersistentVolumeClaim (namespace: $namespace, name: $name)
}
`

export const CREATE_SERVICE_MUTATION = gql`
mutation createService ($namespace: String!, $service: ServiceInput!) {
    createService (namespace: $namespace, service: $service) {
        meta {
            name
        }
        ports {
            port
            protocol
        }
        type
        yaml
    }
}
`

export const DELETE_SERVICE_MUTATION = gql`
mutation deleteService ($namespace: String!, $name: String!) {
    deleteService (namespace: $namespace, name: $name)
}
`
