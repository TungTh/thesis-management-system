import { V1ObjectMeta } from '@kubernetes/client-node'

interface V1Object {
	metadata?: V1ObjectMeta,
	[key: string]: any,
	status?: any,
}

export const stripReadOnly = <T extends V1Object> (obj: T): V1Object => {
	let stripped = Object.assign({}, obj);

	delete stripped.status;
	delete stripped.metadata.creationTimestamp;
	delete stripped.metadata.deletionGracePeriodSeconds;
	delete stripped.metadata.deletionTimestamp;
	delete stripped.metadata.generation;
	delete stripped.metadata.resourceVersion;
	delete stripped.metadata.selfLink;
	delete stripped.metadata.uid;

	return stripped;
}