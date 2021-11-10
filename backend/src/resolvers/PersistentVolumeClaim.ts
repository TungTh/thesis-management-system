import * as coreAPI from '../k8s/coreAPI';
import { GQLMetadata, GQLPersistentVolumeClaim, GQLResourceRequirements, GQLVolumeAccessMode } from "../schemaTypes";

export const meta = (parent: GQLPersistentVolumeClaim, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const volumeName = async (parent: GQLPersistentVolumeClaim, args, context, info): Promise<String> => {
	const pvc = await coreAPI.getPersistentVolumeClaimInfo(parent.meta.namespace.name, parent.meta.name);

	return pvc.volumeName;
}

export const volumeMode = async (parent: GQLPersistentVolumeClaim, args, context, info): Promise<String> => {
	const pvc = await coreAPI.getPersistentVolumeClaimInfo(parent.meta.namespace.name, parent.meta.name);
	
	return pvc.volumeMode;
}

export const accessMode = async (parent: GQLPersistentVolumeClaim, args, context, info): Promise<GQLVolumeAccessMode[]> => {
	const pvc = await coreAPI.getPersistentVolumeClaimInfo(parent.meta.namespace.name, parent.meta.name);

	return pvc.accessMode;
}

export const resources = async (parent: GQLPersistentVolumeClaim, args, context, info): Promise<GQLResourceRequirements> => {
	const pvc = await coreAPI.getPersistentVolumeClaimInfo(parent.meta.namespace.name, parent.meta.name);

	return pvc.resources;
}