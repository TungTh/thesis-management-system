import * as coreAPI from '../k8s/coreAPI';
import { GQLMetadata, GQLPersistentVolume, GQLPersistentVolumeReclaimPolicy, GQLVolumeAccessMode } from "../schemaTypes";

export const meta = (parent: GQLPersistentVolume, args, context, info): GQLMetadata => {
	return parent.meta;
}

export const accessMode = async (parent: GQLPersistentVolume, args, context, info): Promise<GQLVolumeAccessMode[]> => {
	const pv = await coreAPI.getPersistentVolumeInfo(parent.meta.name);

	return pv.accessMode;
}

export const volumeMode = async (parent: GQLPersistentVolume, args, context, info): Promise<string> => {
	const pv = await coreAPI.getPersistentVolumeInfo(parent.meta.name);
	
	return pv.volumeMode;
}

export const capacity = async (parent: GQLPersistentVolume, args, context, info): Promise<string> => {
	const pv = await coreAPI.getPersistentVolumeInfo(parent.meta.name);
	
	return pv.capacity;
}

export const reclaimPolicy = async (parent: GQLPersistentVolume, args, context, info): Promise<GQLPersistentVolumeReclaimPolicy> => {
	const pv = await coreAPI.getPersistentVolumeInfo(parent.meta.name);
	
	return pv.reclaimPolicy;
}