import k8s from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import { GQLDeployment, GQLMetadata, GQLStatefulSet } from '../schemaTypes';
import { stripReadOnly } from './objectUtil';
const { KubeConfig, AppsV1Api } = k8s;

const kc = new KubeConfig();
kc.loadFromDefault();

const api = kc.makeApiClient(AppsV1Api);

export const getDeploymentMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	const res = await api.listNamespacedDeployment(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let deployments = res.body.items.map(dpl => <GQLMetadata> {
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

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	let dpl = stripReadOnly(res.body);

	

	let deployment = <GQLDeployment> {
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

export const getStatefulSetMetasInNamespace = async (namespace: string): Promise<GQLMetadata[]> => {
	var res = await api.listNamespacedStatefulSet(namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	var statefulSets = res.body.items.map(sfs => <GQLMetadata> {
		name: sfs.metadata.name,
		uid: sfs.metadata.uid,
		namespace: {
			name: sfs.metadata.namespace
		}
	})

	return statefulSets;
}

export const getStatefulSetInfo = async (namespace: string, name: string): Promise<GQLStatefulSet> => {
	var res = await api.readNamespacedStatefulSet(name, namespace);

	if (res.response.statusCode !== 200) {
		throw new Error(res.response.statusMessage);
	}

	var sfs = stripReadOnly(res.body);

	var statefulSet = <GQLStatefulSet> {
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

