import * as coreAPI from "../k8s/coreAPI";
import { GQLMetadata, GQLService, GQLServicePort, GQLServiceType } from "../schemaTypes";

export const meta = (parent: GQLService, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const type = async (parent: GQLService, args, context, info): Promise<GQLServiceType> => {
	const svc = await coreAPI.getServiceInfo(parent.meta.namespace.name, parent.meta.name);

	return svc.type;
}

export const dplName = async (parent: GQLService, args, context, info): Promise<string> => {
	const svc = await coreAPI.getServiceInfo(parent.meta.namespace.name, parent.meta.name);

	return svc.dplName;
}

export const ports = async (parent: GQLService, args, context, info): Promise<GQLServicePort[]> => {
	const svc = await coreAPI.getServiceInfo(parent.meta.namespace.name, parent.meta.name);

	return svc.ports;
}

export const yaml = async (parent: GQLService, args, context, info): Promise<string> => {
	const svc = await coreAPI.getServiceInfo(parent.meta.namespace.name, parent.meta.name);

	return svc.yaml;
}