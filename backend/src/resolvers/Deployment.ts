import * as appAPI from '../k8s/appAPI';
import { GQLDeployment, GQLLabel, GQLMetadata } from "../schemaTypes";

export const meta = (parent: GQLDeployment, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const replicas = async (parent: GQLDeployment, args, context, info): Promise<number> => {
	const dplInfo = await appAPI.getDeploymentInfo(parent.meta.namespace.name, parent.meta.name);

	return dplInfo.replicas;
}

export const labelSelector = async (parent: GQLDeployment, args, context, info): Promise<GQLLabel> => {
	const dplInfo = await appAPI.getDeploymentInfo(parent.meta.namespace.name, parent.meta.name);

	return dplInfo.labelSelector;
}

export const yaml = async (parent: GQLDeployment, args, context, info): Promise<string> => {
	const dplInfo = await appAPI.getDeploymentInfo(parent.meta.namespace.name, parent.meta.name);
	
	return dplInfo.yaml;
}