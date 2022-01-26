import { PrismaClient } from "@prisma/client";
import { exec } from 'child_process';
import * as portfinder from 'portfinder';
import * as appAPI from "../k8s/appAPI";
import * as coreAPI from "../k8s/coreAPI";
import { GQLConfigMap, GQLDeployment, GQLNamespace, GQLPersistentVolume, GQLPersistentVolumeClaim, GQLPod, GQLSecret, GQLService, GQLStatefulSet, GQLThesis, GQLUser } from "../schemaTypes";
import { K8S_TIMEOUT } from "../util/UtilConstant";

interface NamespacedObject {
	namespace: string,
	[key: string]: string,
}

export const allUsers = async (parent, args, context: {prisma: PrismaClient}, info): Promise<Array<GQLUser>> => {
	const users = await context.prisma.user.findMany({
		where: {
			active: true,
		},
		orderBy: {
			name: "asc"
		}
	});
	
	return users;
}

export const getUserById = async (parent: any, args: { id: string; }, context: {prisma: PrismaClient}, info: any): Promise<GQLUser> => {
	const user = await context.prisma.user.findFirst({
		where: {
			id: args.id,
			active: true
		}
	});

	return user;
}

export const allTheses = async (parent, args, context: {prisma: PrismaClient}, info): Promise<Array<GQLThesis>> => {
	const theses = await context.prisma.thesis.findMany({
		orderBy: {
			title: "asc"
		},
		include: {
			user: true,
			tags: {
				include: {
					tag: true
				}
			},
			namespace: true
		}	
	});

	return theses.map(thesis => {
		return {
			id: thesis.id,
			title: thesis.title,
			studentName: thesis.studentName,
			studentID: thesis.studentID,
			supervisorName: thesis.supervisorName,
			semester: thesis.semester,
			summary: thesis.summary,
			...(thesis.report && {report: thesis.report.toString('base64')}),
			namespace: {
				name: thesis.namespace.name,
			},
			user: {
				id: thesis.userId,
				name: thesis.user.name,
				username: thesis.user.username,
			},
			tags: thesis.tags.map(tag => {
				return {
					name: tag.tag.name,
				}
			})
		}
	});
}

export const getThesisById = async (parent: any, args: { id: string; }, context: {prisma: PrismaClient}, info: any): Promise<GQLThesis> => {
	const thesis = await context.prisma.thesis.findUnique({
		where: {
			id: args.id
		},
		include: {
			user: true,
			tags: {
				include: {
					tag: true
				}
			},
			namespace: true
		}
	});

	return {
		id: thesis.id,
		title: thesis.title,
		studentName: thesis.studentName,
		studentID: thesis.studentID,
		supervisorName: thesis.supervisorName,
		semester: thesis.semester,
		summary: thesis.summary,
		...(thesis.report && {report: thesis.report.toString('base64')}),
		namespace: {
			name: thesis.namespace.name,
		},
		user: {
			id: thesis.userId,
			name: thesis.user.name,
			username: thesis.user.username,
		},
		tags: thesis.tags.map(tag => {
			return {
				name: tag.tag.name,
			}
		})
	}
}

export const allNamespaces = async (parent, args, context, info): Promise<GQLNamespace[]> => {
	return await coreAPI.getNamespaces();
}

export const allPods = async (parent, args: NamespacedObject, context, info): Promise<GQLPod[]> => {
	const podMetas = await coreAPI.getPodMetasInNamespace(args.namespace);

	const pods = podMetas.map(podMeta => <GQLPod> {
		meta: podMeta
	});

	return pods;	
}

export const allDeployments = async (parent, args: NamespacedObject, context, info): Promise<GQLDeployment[]> => {
	const dplMetas = await appAPI.getDeploymentMetasInNamespace(args.namespace);

	const deployments = dplMetas.map(dplMeta => <GQLDeployment> {
		meta: dplMeta
	});

	return deployments;
}

export const allStatefulSets = async (parent, args: NamespacedObject, context, info): Promise<GQLStatefulSet[]> => {
	const sfsMetas = await appAPI.getStatefulSetMetasInNamespace(args.namespace);

	const statefulSets = sfsMetas.map(sfsMeta => <GQLStatefulSet> {
		meta: sfsMeta
	});

	return statefulSets;
}

export const allServices = async (parent, args: NamespacedObject, context, info): Promise<GQLService[]> => {
	const serviceMetas = await coreAPI.getServiceMetasInNamespace(args.namespace);

	const services = serviceMetas.map(serviceMeta => <GQLService> {
		meta: serviceMeta
	});

	return services;
}

export const allConfigMaps = async (parent, args: NamespacedObject, context, info): Promise<GQLConfigMap[]> => {
	const cfgMapMetas = await coreAPI.getConfigMapMetasInNamespace(args.namespace);

	const configMaps = cfgMapMetas.map(cfgMapMeta => <GQLConfigMap> {
		meta: cfgMapMeta
	});

	return configMaps;
}

export const allSecrets = async (parent, args: NamespacedObject, context, info): Promise<GQLSecret[]> => {
	const secretMetas = await coreAPI.getSecretMetasInNamespace(args.namespace);

	const secrets = secretMetas.map(secretMeta => <GQLSecret> {
		meta: secretMeta
	});

	return secrets;
}

export const allPersistentVolumes = async (parent, args, context, info): Promise<GQLPersistentVolume[]> => {
	const pvMetas = await coreAPI.getPersistentVolumeMetas();

	const persistentVolumes = pvMetas.map(pvMeta => <GQLPersistentVolume> {
		meta: pvMeta
	});

	return persistentVolumes;
}

export const allPersistentVolumeClaims = async (parent, args: NamespacedObject, context, info): Promise<GQLPersistentVolumeClaim[]> => {
	const pvcMetas = await coreAPI.getPersistentVolumeClaimMetasInNamespace(args.namespace);

	const persistentVolumeClaims = pvcMetas.map(pvcMeta => <GQLPersistentVolumeClaim> {
		meta: pvcMeta
	});

	return persistentVolumeClaims;
}

export const getServiceDemo = async (parent, args: { namespace: string}, context, info): Promise<string> => {
	const port = await portfinder.getPortPromise();

	if (!port) {
		throw new Error('Cannot find available port');
	}

	const ns = await coreAPI.getNamespaces();

	if (!ns.find(n => n.name === args.namespace)) {
		throw new Error('Namespace not found');
	}

	
	const deployments = await appAPI.getDeploymentMetasInNamespace(args.namespace);
	deployments.forEach(async (dplMeta) => {
		await appAPI.scaleDeployment(args.namespace, dplMeta.name, 1);
		setTimeout(appAPI.scaleDeployment, K8S_TIMEOUT, args.namespace, dplMeta.name, 0);
	});

	await new Promise(resolve => setTimeout(resolve, 5000)); // wait for pod to be ready

	const services = await coreAPI.getServiceMetasInNamespace(args.namespace);
	const service = (await Promise.all(services.map(async serviceMeta => {
		return await coreAPI.getServiceInfo(args.namespace, serviceMeta.name);
	}))).find(service => service.type === 'LoadBalancer');

	const pf = exec(`dist\\scripts\\portForward.bat ${service.meta.name} ${port} ${service.ports[0].targetPort} ${args.namespace}`, 
	(err, stdout, stderr) => {
		if (err) {
			console.error(err);
			pf.kill();
		}
		console.log(stdout);
		console.log(stderr);
	});

	setTimeout(pf.kill, K8S_TIMEOUT);

	return `http://localhost:${port}`;
}