import k8s from "@kubernetes/client-node";
import * as yaml from "js-yaml";
import { GQLConfigMap, GQLMapValue, GQLMetadata, GQLNamespace, GQLPersistentVolumeClaim, GQLPod, GQLSecret, GQLService, GQLServicePort, GQLVolumeAccessMode } from "../schemaTypes";
import { stripReadOnly } from "./objectUtil";

const { CoreV1Api, KubeConfig } = k8s;
const kc = new KubeConfig();
kc.loadFromDefault();

const api = kc.makeApiClient(CoreV1Api);

export const getNamespaces = async (): Promise<GQLNamespace[]> => {
	const res = await api.listNamespace();

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	var namespaces: GQLNamespace[];

	namespaces = res.body.items.map(ns => ({
		name: ns.metadata.name
	}));
	
	return namespaces;
}

export const createNamespace = async (name: string): Promise<GQLNamespace> => {
	const namespace = <k8s.V1Namespace> {
		metadata: {
			name: name
		}
	}

	const res = await api.createNamespace(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	return <GQLNamespace> {
		name: res.body.metadata.name
	}
}

export const getPodMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedPod(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let podMetas = res.body.items.map(pod => <GQLMetadata> {
		name: pod.metadata.name,
		uid: pod.metadata.uid,
		namespace: {
			name: pod.metadata.namespace
		}
	});

	return podMetas;
}

export const getPodInfo = async (namespace: string, podName: string): Promise<GQLPod> => {
	const res = await api.readNamespacedPod(podName, namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let pod = <GQLPod> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace
			}
		},
		hostIP: res.body.status.hostIP,
		podIP: res.body.status.podIP,
		status: res.body.status.phase,
	}

	return pod;
}

export const getServiceMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedService(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let serviceMetas = res.body.items.map(svc => <GQLMetadata> {
		name: svc.metadata.name,
		uid: svc.metadata.uid,
		namespace: {
			name: svc.metadata.namespace
		}
	});

	return serviceMetas;
}

export const getServiceInfo = async (namespace: string, name: string): Promise<GQLService> => {
	const res = await api.readNamespacedService(name, namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let svc = stripReadOnly(res.body);

	let selectors = Object.entries(res.body.spec.selector).map(keyValue => ({
		name: keyValue[0],
		value: keyValue[1],
	}))

	let ports = res.body.spec.ports.map(servicePort => <GQLServicePort> {
		name: servicePort.name,
		protocol: servicePort.protocol,
		port: servicePort.port.toString(),
		targetPort: servicePort.targetPort.toString(),
		nodePort: servicePort.nodePort.toString(),
	})

	let service = <GQLService> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		type: res.body.spec.type,
		selector: selectors,
		ports: ports,
		yaml: yaml.dump(svc),
	}

	return service;
}

export const getSecretMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedSecret(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let secretMetas = res.body.items.map(secret => <GQLMetadata> {
		name: secret.metadata.name,
		uid: secret.metadata.uid,
		namespace: {
			name: secret.metadata.namespace
		}
	}); 

	return secretMetas;
}

export const getSecretInfo = async (namespace: string, name: string): Promise<GQLSecret> => {
	const res = await api.readNamespacedSecret(name, namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let data = <GQLMapValue[]> Object.entries(res.body.data).map(keyValue => ({
		key: keyValue[0],
		value: Buffer.from(keyValue[1], 'base64').toString(),
	}))

	let yamlString = yaml.dump(stripReadOnly(res.body));

	let secret = <GQLSecret> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		type: res.body.type,
		data: data,
		yaml: yamlString,
	}

	return secret;
}

export const getConfigMapMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedConfigMap(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let configMapMetas = res.body.items.map(cfgMap => <GQLMetadata> {
		name: cfgMap.metadata.name,
		uid: cfgMap.metadata.uid,
		namespace: {
			name: cfgMap.metadata.namespace
		}
	});

	return configMapMetas;
}

export const getConfigMapInfo = async (namespace: string, name: string): Promise<GQLConfigMap> => {
	const res = await api.readNamespacedConfigMap(name, namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let data = <GQLMapValue[]> Object.entries(res.body.data).map(keyValue => ({
		key: keyValue[0],
		value: keyValue[1]
	}))

	let yamlString = yaml.dump(stripReadOnly(res.body));

	let configMap = <GQLConfigMap> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		data: data,
		yaml: yamlString,
	}

	return configMap;
}

export const getPersistentVolumeClaimMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedPersistentVolumeClaim(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let pvcMetas = res.body.items.map(pvc => <GQLMetadata> {
		name: pvc.metadata.name,
		uid: pvc.metadata.uid,
		namespace: {
			name: pvc.metadata.namespace,
		}
	})

	return pvcMetas;
}

export const getPersistentVolumeClaimInfo = async (namespace: string, name: string): Promise<GQLPersistentVolumeClaim> => {
	const res = await api.readNamespacedPersistentVolumeClaim(namespace, name);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let accessModes = res.body.spec.accessModes.map(mode => GQLVolumeAccessMode[mode as keyof typeof GQLVolumeAccessMode]);

	let pvc = <GQLPersistentVolumeClaim> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		volumeName: res.body.spec.volumeName,
		volumeMode: res.body.spec.volumeMode,
		accessMode: accessModes,
		resources: {
			limits: {
				cpu: res.body.spec.resources.limits.cpu,
				memory: res.body.spec.resources.limits.memory,
			},
			requests: {
				cpu: res.body.spec.resources.requests.cpu,
				memory: res.body.spec.resources.requests.memory,
			}
		}
	};

	return pvc;
}