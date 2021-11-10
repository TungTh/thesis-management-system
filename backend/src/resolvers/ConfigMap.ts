import * as coreAPI from '../k8s/coreAPI';
import { GQLConfigMap, GQLMapValue, GQLMetadata } from "../schemaTypes";

export const meta = (parent: GQLConfigMap, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const data = async (parent: GQLConfigMap, args, context, info): Promise<GQLMapValue[]> => {
	const cfgMap = await coreAPI.getConfigMapInfo(parent.meta.namespace.name, parent.meta.name);

	return cfgMap.data;
}

export const yaml = async (parent: GQLConfigMap, args, context, info): Promise<string> => {
	const cfgMap = await coreAPI.getConfigMapInfo(parent.meta.namespace.name, parent.meta.name);

	return cfgMap.yaml;
}
