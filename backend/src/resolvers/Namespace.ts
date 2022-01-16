import * as coreAPI from "../k8s/coreAPI"
import * as appAPI from "../k8s/appAPI"
import { GQLConfigMap, GQLDeployment, GQLNamespace, GQLPod, GQLSecret, GQLService, GQLStatefulSet } from "../schemaTypes";

export const name = (parent: GQLNamespace, args, context, info): string => {
	return parent.name;
}

export const pods = async (parent: GQLNamespace, args, context, info): Promise<GQLPod[]> => {
	const podMetas = await coreAPI.getPodMetasInNamespace(parent.name);

	const pods = podMetas.map(podMeta => <GQLPod> {
		meta: podMeta
	});

	return pods;
}

export const deployments = async (parent: GQLNamespace, args, context, info): Promise<GQLDeployment[]> => {
	const dplMetas = await appAPI.getDeploymentMetasInNamespace(parent.name);

	const deployments = dplMetas.map(dplMeta => <GQLDeployment> {
		meta: dplMeta 
	});

	return deployments;
}

export const statefulSets = async (parent: GQLNamespace, args, context, info): Promise<GQLStatefulSet[]> => {
	const sfsMetas = await appAPI.getStatefulSetMetasInNamespace(parent.name);

	const statefulSets = sfsMetas.map(sfsMeta => <GQLStatefulSet> {
		meta: sfsMeta
	});

	return statefulSets;
}

export const configMaps = async (parent: GQLNamespace, args, context, info): Promise<GQLConfigMap[]> => {
	const cfgMapMetas = await coreAPI.getConfigMapMetasInNamespace(parent.name);

	const configMaps = cfgMapMetas.map(cfgMapMeta => <GQLConfigMap> {
		meta: cfgMapMeta
	});

	return configMaps;
}

export const secrets = async (parent: GQLNamespace, args, context, info): Promise<GQLSecret[]> => {
	const secretMetas = await coreAPI.getSecretMetasInNamespace(parent.name);

	const secrets = secretMetas.map(secretMeta => <GQLSecret> {
		meta: secretMeta
	});

	return secrets;
}

export const services = async (parent: GQLNamespace, args, context, info): Promise<GQLService[]> => {
	const serviceMetas = await coreAPI.getServiceMetasInNamespace(parent.name);

	const services = serviceMetas.map(serviceMeta => <GQLService> {
		meta: serviceMeta
	});

	return services;
}