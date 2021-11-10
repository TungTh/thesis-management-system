import * as coreAPI from "../k8s/coreAPI";
import { GQLMetadata, GQLPod } from "../schemaTypes";

export const meta = (parent: GQLPod, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const hostIP = async (parent: GQLPod, args, context, info): Promise<string> => {
	const podInfo = await coreAPI.getPodInfo(parent.meta.namespace.name, parent.meta.name);
	return podInfo.hostIP;
}

export const podIP = async (parent: GQLPod, args, context, info): Promise<string> => {
	const podInfo = await coreAPI.getPodInfo(parent.meta.namespace.name, parent.meta.name);
	return podInfo.podIP;
}

export const status = async (parent: GQLPod, args, context, info) => {
	const podInfo = await coreAPI.getPodInfo(parent.meta.namespace.name, parent.meta.name);
	return podInfo.status;
}
