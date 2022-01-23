import gql from 'graphql-tag';

export const ALLTEST_QUERY = gql`
    query allTests {
        allTests {
            id
            title
            type
        }
    }
`;

export const ALLTHESES_QUERY = gql`
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
`;


export const DONETEST_BYUSERID_QUERY = gql`
	query getUserById($id: Int!) {
		getUserById(id: $id) {
			doneTests {
				id
			}
		}
	}
`;

export const TEST_BYID_QUERY = gql` 	
	query getTestById($id: Int!) {
		getTestById(id: $id) {
			id
			type
			sections {
				id
 				order
				type
				statementText
				statementAudio
				questionGroups {
					id
					order
					introText
					questions {
						id
						order
						type
						statementText
						answers {
							id
							text
						}
					}
				}
			}
		}
	}
`;

/*
 export const TESTRESULT_BYID_QUERY = gql`
     query getTestResult($userId: Int!, $testId: Int!) {
         getTestResult(userId: $userId, testId: $testId) {
             test {
                 type
                 sections {
                     order
                     type
                     statementText
                     statementAudio
                     questionList {
                         order
                         introText
                         questions {
                             order
                             statementText
                         }
                     }
                 }
             }
 			score
 			answerHistory {
 				question {
 					order
 				}
 				answer {
 					text
 				}
 			}
         }
     }
 `;
 */

export const TESTDONEYET_BYID_QUERY = gql`
	query getTestResult($userId: Int!, $testId: Int!) {
     	getTestResult(userId: $userId, testId: $testId) {
     		test {
     			id
				title
				type
     		}
     		score
			answerHistory {
				question {
                    statementText
					trueAnswer {
						text
					}
				}
				answer {
					text
				}
			}
     	}
	}
`;

export const TESTCOMMENT_BYID_QUERY = gql`
	query getTestById($id: Int!) {
		getTestById(id: $id) {
			comments {
				id
				user {
					id
					username
				}
				content
				created
			}
		}
	}
`;