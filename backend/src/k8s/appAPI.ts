import k8s from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import { GQLDeployment, GQLDeploymentInput, GQLMetadata, GQLStatefulSet, GQLStatefulSetInput } from '../schemaTypes';
import { errorStatusCodes } from '../util/UtilConstant';
import { stripReadOnly } from './objectUtil';
const { KubeConfig, AppsV1Api } = k8s;

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
			replicas: deployment.replicas,
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
			replicas: statefulSet.replicas,
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