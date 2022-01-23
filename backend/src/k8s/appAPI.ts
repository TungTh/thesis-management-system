import k8s from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import { GQLDeployment, GQLDeploymentInput, GQLMetadata, GQLStatefulSet, GQLStatefulSetInput } from '../schemaTypes';
import { errorStatusCodes } from '../util/UtilConstant';
import { stripReadOnly } from './objectUtil';
const { KubeConfig, AppsV1Api} = k8s;

const kc = new KubeConfig();
kc.loadFromDefault();

const api = kc.makeApiClient(AppsV1Api);

export const getDeploymentMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedDeployment(namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const deployments = res.body.items.map(dpl => <GQLMetadata> {
		name: dpl.metadata.name,
		uid: dpl.metadata.uid,
		namespace: {
			name: dpl.metadata.namespace
		}
	})

	return deployments;
}

export const getDeploymentInfo = async (namespace: string, name: string): Promise<GQLDeployment> => {
	const res = await api.readNamespacedDeployment(name, namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const dpl = stripReadOnly(res.body);

	const deployment = <GQLDeployment> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace
			},
		},
		template: {
			...dpl.spec.template.spec
		},
		replicas: res.body.spec.replicas,
		yaml: yaml.dump(dpl),
	}

	return deployment;
}

export const createDeployment = async (namespace: string, deployment: GQLDeploymentInput): Promise<GQLDeployment> => {
	const dpl = <k8s.V1Deployment> {
		metadata: {
			name: deployment.name,
			namespace: namespace,
		},
		spec: {
			replicas: 0,
			selector: {
				matchLabels: {
					app: deployment.name,
				}
			},
			template: {
				metadata: {
					labels: {
						app: deployment.name,
					}
				},
				spec: {
					containers: deployment.template.containers.map(c => {
						return {
							name: c.name,
							image: c.image,
							...(c.ports && {ports: c.ports.map(p => {
								return {
									containerPort: p.containerPort,
									protocol: p.protocol,
								}
							})}),
							...(c.env && {env: c.env.map(e => {
								return {
									name: e.name,
									value: e.value,
									valueFrom: e.valueFrom,
								}
							})}),
							...(c.resources && {resources: {
								...(c.resources.limits && {limits: {
									cpu: c.resources.limits.cpu,
									memory: c.resources.limits.memory,
								}}),
								...(c.resources.requests && {requests: {
									cpu: c.resources.requests.cpu,
									memory: c.resources.requests.memory,
								}}),
							}}),
						}
					}),
					...(deployment.template.volumes && {volumes: deployment.template.volumes.map(v => {
						return <k8s.V1Volume> {
							name: v.name,
							persistentVolumeClaim: {
								claimName: v.persistentVolumeClaim,
								readOnly: false
							}
						}
					})}),
				}
			}
		}
	}

	const res = await api.createNamespacedDeployment(namespace, dpl);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getDeploymentInfo(namespace, deployment.name);
}

export const deleteDeployment = async (namespace: string, name: string): Promise<GQLDeployment> => {
	const deployment = await getDeploymentInfo(namespace, name);

	const res = await api.deleteNamespacedDeployment(name, namespace);
	
	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return deployment;
}

export const scaleDeployment = async (namespace: string, name: string, replicas: number): Promise<boolean> => {
	console.log(`Scaling deployment ${name} to ${replicas} replicas`);
	const res = await api.patchNamespacedDeployment(name, namespace, <k8s.V1Deployment> {
		spec: {
			replicas: replicas,
		}
	}, undefined, undefined, undefined, undefined, {
		headers: {
			'Content-Type': 'application/merge-patch+json',
		}
	});
	
	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return true;
}

export const getStatefulSetMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedStatefulSet(namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const statefulSets = res.body.items.map(sfs => <GQLMetadata> {
		name: sfs.metadata.name,
		uid: sfs.metadata.uid,
		namespace: {
			name: sfs.metadata.namespace
		}
	})

	return statefulSets;
}

export const getStatefulSetInfo = async (namespace: string, name: string): Promise<GQLStatefulSet> => {
	const res = await api.readNamespacedStatefulSet(name, namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const sfs = stripReadOnly(res.body);

	const statefulSet = <GQLStatefulSet> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		template: {
			...sfs.spec.template.spec,
		},
		replicas: res.body.spec.replicas,
		yaml: yaml.dump(sfs),
	}

	return statefulSet;
}

export const createStatefulSet = async (namespace: string, statefulSet: GQLStatefulSetInput): Promise<GQLStatefulSet> => {
	const sfs = <k8s.V1StatefulSet> {
		metadata: {
			name: statefulSet.name,
			namespace: namespace,
		},
		spec: {
			replicas: 0,
			selector: {
				matchLabels: {
					app: statefulSet.name,
				}
			},
			serviceName: statefulSet.serviceName,
			template: {
				metadata: {
					labels: {
						app: statefulSet.name,
					}
				},
				spec: {
					containers: statefulSet.template.containers.map(c => {
						return {
							name: c.name,
							image: c.image,
							...(c.ports && {ports: c.ports.map(p => {
								return {
									containerPort: p.containerPort,
									protocol: p.protocol,
								}
							})}),
							...(c.env && {env: c.env.map(e => {
								return {
									name: e.name,
									value: e.value,
									valueFrom: e.valueFrom,
								}
							})}),
							...(c.resources && {resources: {
								...(c.resources.limits && {limits: {
									cpu: c.resources.limits.cpu,
									memory: c.resources.limits.memory,
								}}),
								...(c.resources.requests && {requests: {
									cpu: c.resources.requests.cpu,
									memory: c.resources.requests.memory,
								}}),
							}}),
						}
					}),
				}
			}
		}
	}

	const res = await api.createNamespacedStatefulSet(namespace, sfs);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getStatefulSetInfo(namespace, statefulSet.name);
}

export const deleteStatefulSet = async (namespace: string, name: string): Promise<GQLStatefulSet> => {
	const statefulSet = await getStatefulSetInfo(namespace, name);

	const res = await api.deleteNamespacedStatefulSet(name, namespace);
	
	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return statefulSet;
}

export const scaleStatefulSet = async (namespace: string, name: string, replicas: number): Promise<boolean> => {
	const res = await api.patchNamespacedStatefulSet(name, namespace, <k8s.V1StatefulSet> {
		spec: {
			replicas: replicas,
		}
	}, undefined, undefined, undefined, undefined, {
		headers: {
			'Content-Type': 'application/merge-patch+json',
		}
	});
	
	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return true;
}