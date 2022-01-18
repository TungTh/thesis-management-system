import * as appAPI from '../k8s/appAPI';
import { GQLMetadata, GQLStatefulSet } from "../schemaTypes";

export const meta = (parent: GQLStatefulSet, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const replicas = async (parent: GQLStatefulSet, args, context, info): Promise<number> => {
	const sfsInfo = await appAPI.getStatefulSetInfo(parent.meta.namespace.name, parent.meta.name);

	return sfsInfo.replicas;
}

export const serviceName = async (parent: GQLStatefulSet, args, context, info): Promise<string> => {
	const sfsInfo = await appAPI.getStatefulSetInfo(parent.meta.namespace.name, parent.meta.name);

	return sfsInfo.serviceName;
}

export const yaml = async (parent: GQLStatefulSet, args, context, info): Promise<string> => {
	const sfsInfo = await appAPI.getStatefulSetInfo(parent.meta.namespace.name, parent.meta.name);
	
	return sfsInfo.yaml;
}