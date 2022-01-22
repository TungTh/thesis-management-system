import k8s from "@kubernetes/client-node";
import * as yaml from "js-yaml";
import { GQLConfigMap, GQLConfigMapInput, GQLMapValue, GQLMetadata, GQLNamespace, GQLPersistentVolume, GQLPersistentVolumeClaim, GQLPersistentVolumeClaimInput, GQLPersistentVolumeInput, GQLPersistentVolumeReclaimPolicy, GQLPod, GQLSecret, GQLSecretInput, GQLService, GQLServiceInput, GQLServicePort, GQLVolumeAccessMode } from "../schemaTypes";
import { errorStatusCodes } from "../util/UtilConstant";
import { stripReadOnly } from "./objectUtil";

const { CoreV1Api, KubeConfig } = k8s;
const kc = new KubeConfig();
kc.loadFromDefault();

const api = kc.makeApiClient(CoreV1Api);

export const getNamespaces = async (): Promise<GQLNamespace[]> => {
	const res = await api.listNamespace();

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const namespaces = <GQLNamespace[]> res.body.items.map(ns => ({
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		console.log(`[LOG] Error creating namespace ${name}, statusCode: ${res.response.statusCode}`);
		throw new Error(res.response.statusMessage);
	}

	return <GQLNamespace> {
		name: res.body.metadata.name
	}
}

export const deleteNamespace = async (name: string): Promise<GQLNamespace> => {
	const res = await api.deleteNamespace(name);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		console.log(`[LOG] Error deleting namespace ${name}, statusCode: ${res.response.statusCode}`);
		throw new Error(res.response.statusMessage);
	}

	return <GQLNamespace> {
		name: name
	}
}

export const getPodMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedPod(namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const podMetas = res.body.items.map(pod => <GQLMetadata> {
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const pod = <GQLPod> {
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const serviceMetas = res.body.items.map(svc => <GQLMetadata> {
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const svc = stripReadOnly(res.body);

	const ports = res.body.spec.ports.map(servicePort => <GQLServicePort> {
		name: servicePort.name,
		protocol: servicePort.protocol,
		port: servicePort.port,
		targetPort: parseInt(servicePort.targetPort.toString()),
		nodePort: servicePort.nodePort,
	})

	const service = <GQLService> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		dplName: res.body.spec.selector && res.body.spec.selector.app ? res.body.spec.selector.app : "",
		type: res.body.spec.type,
		ports: ports,
		yaml: yaml.dump(svc),
	}

	return service;
}

export const createService = async (namespace: string, service: GQLServiceInput): Promise<GQLService> => {
	const svc = <k8s.V1Service> {
		metadata: {
			name: service.name,
			namespace: namespace,
		},
		spec: {
			selector: {
				app: service.dplName,
			},
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: targetPort is not defined in type
			ports: service.ports.map(port => <k8s.V1ServicePort> {
				name: port.name,
				protocol: port.protocol,
				port: port.port,
				targetPort: port.targetPort,
				nodePort: port.nodePort,
			}),
			type: service.type,
		}
	}

	const res = await api.createNamespacedService(namespace, svc);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getServiceInfo(namespace, service.name);
}

export const deleteService = async (namespace: string, name: string): Promise<GQLService> => {
	const service = await getServiceInfo(namespace, name);

	const res = await api.deleteNamespacedService(name, namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return service;
}

export const getSecretMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedSecret(namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const secretMetas = res.body.items.map(secret => <GQLMetadata> {
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const data = <GQLMapValue[]> Object.entries(res.body.data).map(keyValue => ({
		key: keyValue[0],
		value: Buffer.from(keyValue[1], 'base64').toString(),
	}))

	const yamlString = yaml.dump(stripReadOnly(res.body));

	const secret = <GQLSecret> {
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

export const createSecret = async (namespace: string, secret: GQLSecretInput): Promise<GQLSecret> => {
	const sec = <k8s.V1Secret> { 
		metadata: {
			name: secret.name,
			namespace: namespace,
		},
		type: secret.type,
		data: Object.entries(secret.data).reduce((acc, keyValue) => {
			acc[keyValue[1].key] = Buffer.from(keyValue[1].value).toString('base64');
			return acc;
		}, {}),
	}

	const res = await api.createNamespacedSecret(namespace, sec);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getSecretInfo(namespace, secret.name);
}

export const deleteSecret = async (namespace: string, name: string): Promise<GQLSecret> => {
	const secret = await getSecretInfo(namespace, name);

	const res = await api.deleteNamespacedSecret(name, namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return secret;
}

export const getConfigMapMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedConfigMap(namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const configMapMetas = res.body.items.map(cfgMap => <GQLMetadata> {
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const data = <GQLMapValue[]> Object.entries(res.body.data).map(keyValue => ({
		key: keyValue[0],
		value: keyValue[1]
	}))

	const yamlString = yaml.dump(stripReadOnly(res.body));

	const configMap = <GQLConfigMap> {
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

export const createConfigMap = async (namespace: string, configMap: GQLConfigMapInput): Promise<GQLConfigMap> => {
	const cfgMap = <k8s.V1ConfigMap> {
		metadata: {
			name: configMap.name,
			namespace: namespace,
		},
		data: Object.entries(configMap.data).reduce((acc, keyValue) => {
			acc[keyValue[1].key] = keyValue[1].value;
			return acc;
		}, {}),
	}

	const res = await api.createNamespacedConfigMap(namespace, cfgMap);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getConfigMapInfo(namespace, configMap.name);
}

export const deleteConfigMap = async (namespace: string, name: string): Promise<GQLConfigMap> => {
	const configMap = await getConfigMapInfo(namespace, name);

	const res = await api.deleteNamespacedConfigMap(name, namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return configMap;
}

export const getPersistentVolumeClaimMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedPersistentVolumeClaim(namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const pvcMetas = res.body.items.map(pvc => <GQLMetadata> {
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

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const accessModes = res.body.spec.accessModes.map(mode => GQLVolumeAccessMode[mode as keyof typeof GQLVolumeAccessMode]);

	const pvc = <GQLPersistentVolumeClaim> {
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

export const createPersistentVolumeClaim = async (namespace: string, pvc: GQLPersistentVolumeClaimInput): Promise<GQLPersistentVolumeClaim> => {
	const pvcObj = <k8s.V1PersistentVolumeClaim> {
		metadata: {
			name: pvc.meta.name,
			namespace: namespace,
		},
		spec: {
			accessModes: pvc.accessMode,
			volumeName: pvc.volumeName,
			volumeMode: pvc.volumeMode,
			resources: {
				limits: {
					cpu: pvc.resources.limits.cpu,
					memory: pvc.resources.limits.memory,
				},
				requests: {
					cpu: pvc.resources.requests.cpu,
					memory: pvc.resources.requests.memory,
				}
			}
		}
	}

	const res = await api.createNamespacedPersistentVolumeClaim(namespace, pvcObj);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getPersistentVolumeClaimInfo(namespace, pvc.meta.name);
}

export const deletePersistentVolumeClaim = async (namespace: string, name: string): Promise<GQLPersistentVolumeClaim> => {
	const pvc = await getPersistentVolumeClaimInfo(namespace, name);

	const res = await api.deleteNamespacedPersistentVolumeClaim(name, namespace);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return pvc;
}

export const getPersistentVolumeMetas = async (): Promise<GQLMetadata[]> => {
	const res = await api.listPersistentVolume();

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const pvMetas = res.body.items.map(pv => <GQLMetadata> {
		name: pv.metadata.name,
		uid: pv.metadata.uid,
	})

	return pvMetas;
}

export const getPersistentVolumeInfo = async (name: string): Promise<GQLPersistentVolume> => {
	const res = await api.readPersistentVolume(name);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	const pv = <GQLPersistentVolume> {
		meta: {
			name: res.body.metadata.name,
			uid: res.body.metadata.uid,
			namespace: {
				name: res.body.metadata.namespace,
			}
		},
		capacity: res.body.spec.capacity.storage,
		accessMode: res.body.spec.accessModes.map(mode => GQLVolumeAccessMode[mode as keyof typeof GQLVolumeAccessMode]),
		volumeMode: res.body.spec.volumeMode,
		reclaimPolicy: GQLPersistentVolumeReclaimPolicy[res.body.spec.persistentVolumeReclaimPolicy as keyof typeof GQLPersistentVolumeReclaimPolicy],
	}

	return pv;
}

export const createPersistentVolume = async (pv: GQLPersistentVolumeInput): Promise<GQLPersistentVolume> => {
	const pvObj = <k8s.V1PersistentVolume> {
		metadata: {
			name: pv.meta.name,
			namespace: pv.meta.namespace.name,
		},
		spec: {
			capacity: {
				storage: pv.capacity,
			},
			accessModes: pv.accessMode,
			volumeMode: pv.volumeMode,
			persistentVolumeReclaimPolicy: pv.reclaimPolicy,
			local: {
				path: `/mnt/data/k8s-volumes/${pv.meta.name}`,
			}
		}
	}

	const res = await api.createPersistentVolume(pvObj);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return getPersistentVolumeInfo(pv.meta.name);
}

export const deletePersistentVolume = async (name: string): Promise<GQLPersistentVolume> => {
	const pv = await getPersistentVolumeInfo(name);

	const res = await api.deletePersistentVolume(name);

	if (errorStatusCodes.includes(res.response.statusCode)) {
		throw new Error(res.response.statusMessage);
	}

	return pv;
}