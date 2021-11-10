import { GQLConfigMap, GQLDeployment, GQLNamespace, GQLPod, GQLSecret, GQLService, GQLStatefulSet } from "../schemaTypes";
import * as appAPI from "../k8s/appAPI";
import * as coreAPI from "../k8s/coreAPI";

interface NamespacedObject {
	namespace: string,
	[key: string]: string,
}

export const allNamespaces = async (parent, args, context, info): Promise<GQLNamespace[]> => {
	return await coreAPI.getNamespaces();
}

export const allPods = async (parent, args: NamespacedObject, context, info): Promise<GQLPod[]> => {
	const podMetas = await coreAPI.getPodMetasInNamespace(args.namespace);

	let pods = podMetas.map(podMeta => <GQLPod> {
		meta: podMeta
	});

	return pods;	
}

export const allDeployments = async (parent, args: NamespacedObject, context, info): Promise<GQLDeployment[]> => {
	const dplMetas = await appAPI.getDeploymentMetasInNamespace(args.namespace);

	let deployments = dplMetas.map(dplMeta => <GQLDeployment> {
		meta: dplMeta
	});

	return deployments;
}

export const allStatefulSets = async (parent, args: NamespacedObject, context, info): Promise<GQLStatefulSet[]> => {
	const sfsMetas = await appAPI.getStatefulSetMetasInNamespace(args.namespace);

	let statefulSets = sfsMetas.map(sfsMeta => <GQLStatefulSet> {
		meta: sfsMeta
	});

	return statefulSets;
}

export const allServices = async (parent, args: NamespacedObject, context, info): Promise<GQLService[]> => {
	const serviceMetas = await coreAPI.getServiceMetasInNamespace(args.namespace);

	let services = serviceMetas.map(serviceMeta => <GQLService> {
		meta: serviceMeta
	});

	return services;
}

export const allConfigMaps = async (parent, args: NamespacedObject, context, info): Promise<GQLConfigMap[]> => {
	const cfgMapMetas = await coreAPI.getConfigMapMetasInNamespace(parent.name);

	let configMaps = cfgMapMetas.map(cfgMapMeta => <GQLConfigMap> {
		meta: cfgMapMeta
	});

	return configMaps;
}

export const allSecrets = async (parent, args: NamespacedObject, context, info): Promise<GQLSecret[]> => {
	const secretMetas = await coreAPI.getSecretMetasInNamespace(parent.name);

	let secrets = secretMetas.map(secretMeta => <GQLSecret> {
		meta: secretMeta
	});

	return secrets;
}