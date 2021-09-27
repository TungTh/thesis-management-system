import { KubeConfig, CoreV1Api,  } from "@kubernetes/client-node"

const kc = new KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(CoreV1Api);

export const getPodNames = async () => {
	var pods = await k8sApi.listNamespacedPod('default');
	var podNames = [];
	for (var pod of pods.body.items) {
		if (pod !== undefined && pod.metadata !== undefined) {
			podNames.push(pod.metadata.name);
		}
	}
	return podNames;
}

