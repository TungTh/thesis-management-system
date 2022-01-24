import gql from 'graphql-tag';

export const ALL_THESES_QUERY = gql`
	query allTheses {
    allTheses {
        id
        title
        studentName
		studentID
        supervisorName
		semester
        summary
        report
    }
}
`;

export const THESIS_BY_ID_QUERY = gql`
    query getThesisById ($id: String!) {
    getThesisById (id: $id) {
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
            deployments {
                meta {
                    name
                    uid
                }
                replicas
                template {
                    meta {
                        name
                        uid
                    }
                    containers {
                        name
                        image
                        resources {
                            limits {
                                cpu
                                memory
                            }
                        }
                    }
                }
                yaml
            }
            statefulSets {
                meta {
                    name
                    uid
                }
                replicas
                serviceName
                template {
                    meta {
                        name
                        uid
                    }
                    containers {
                        name
                        image
                    }
                }
                yaml
            }
            pods {
                meta {
                    name
                    uid
                }
                hostIP
                podIP
                status
            }
            configMaps {
                meta {
                    name
                    uid
                }
                data {
                    key
                    value
                }
                yaml
            }
            secrets {
                meta {
                    name
                    uid
                }
                type
                data {
                    key
                    value
                }
                yaml
            }
            services {
                meta {
                    name
                    uid
                }
                dplName
                type
                ports {
                    name
                    protocol
                    port
                    targetPort
                    nodePort
                }
                yaml
            }
            persistentVolumeClaims {
                meta {
                    name
                    uid
                }
                volumeName
                volumeMode
                accessMode
                resources {
                    limits {
                        cpu
                        memory
                        storage
                    }
                    requests {
                        cpu
                        memory
                        storage
                    }
                }
            }
        }
        user {
            id
            name
            username
            role {
                id
                name
            }
        }
        tags {
            name
        }
    }
}
`

export const ALL_USER_QUERY = gql`
    query allUsers {
        allUsers {
            id
            username
            name
            role {
                id
                name
            }
            thesis {
                id
                title
                namespace {
                    name
                }
            }
        }
    }
`

export const USER_BY_ID_QUERY = gql`
    query getUserById ($id: String!) {
        getUserById (id: $id) {
            id
            name
            username
            thesis {
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
                    deployments {
                        meta {
                            name
                            uid
                        }
                        replicas
                        yaml
                        template {
                            meta {
                                name
                                uid
                            }
                            containers {
                                name
                                image
                                resources {
                                    limits {
                                        cpu
                                        memory
                                    }
                                }
                            }
                        }
                    }
                    statefulSets {
                        meta {
                            name
                            uid
                        }
                        replicas
                        serviceName
                        yaml
                    }
                    pods {
                        meta {
                            name
                            uid
                        }
                        hostIP
                        podIP
                        status
                    }
                    configMaps {
                        meta {
                            name
                            uid
                        }
                        data {
                            key
                            value
                        }
                        yaml
                    }
                    secrets {
                        meta {
                            name
                            uid
                        }
                        type
                        data {
                            key
                            value
                        }
                        yaml
                    }
                    services {
                        meta {
                            name
                            uid
                        }
                        dplName
                        type
                        ports {
                            name
                            protocol
                            port
                            targetPort
                            nodePort
                        }
                        yaml
                    }
                    persistentVolumeClaims {
                        meta {
                            name
                            uid
                        }
                        volumeName
                        volumeMode
                        accessMode
                    }
                }
                tags {
                    name
                }
            }
            role {
                id
                name
            }
        }
    }
`

export const ALL_NAMESPACES_QUERY = gql`
query allNamespaces {
    allNamespaces {
        name
        deployments {
            meta {
                name
            }
        }
        services {
            meta {
                name
            }
        }
        pods {
            meta {
                name
            }
        }
    }
}
`