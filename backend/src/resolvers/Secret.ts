import * as coreAPI from '../k8s/coreAPI';
import { GQLMapValue, GQLMetadata, GQLSecret } from "../schemaTypes";

export const meta = (parent: GQLSecret, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const type = async (parent: GQLSecret, args, context, info): Promise<string> => {
	const secret= await coreAPI.getSecretInfo(parent.meta.namespace.name, parent.meta.name);

	return secret.type;
}

export const data = async (parent: GQLSecret, args, context, info): Promise<GQLMapValue[]> => {
	const secret= await coreAPI.getSecretInfo(parent.meta.namespace.name, parent.meta.name);

	return secret.data;
}

export const yaml = async (parent: GQLSecret, args, context, info): Promise<string> => {
	const secret= await coreAPI.getSecretInfo(parent.meta.namespace.name, parent.meta.name);

	return secret.yaml;
}