import { PrismaClient } from "@prisma/client";
import * as appAPI from "../k8s/appAPI";
import * as coreAPI from "../k8s/coreAPI";
import { GQLConfigMap, GQLDeployment, GQLNamespace, GQLPod, GQLSecret, GQLService, GQLStatefulSet, GQLThesis, GQLUser } from "../schemaTypes";

interface NamespacedObject {
	namespace: string,
	[key: string]: string,
}

export const allUsers = async (parent, args, context: {prisma: PrismaClient}, info): Promise<Array<GQLUser>> => {
	const users = await context.prisma.user.findMany({
		orderBy: {
			name: "asc"
		}
	});
	
	return users.map(user => {
		return {
			id: user.id,
			name: user.name,
			username: user.username,
		}
	});
};

export const getUserById = async (parent: any, args: { id: string; }, context: {prisma: PrismaClient}, info: any): Promise<GQLUser> => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: args.id
		}
	});

	return {
		id: user.id,
		name: user.name,
		username: user.username,
	}
}

export const allTheses = async (parent, args, context: {prisma: PrismaClient}, info): Promise<Array<GQLThesis>> => {
	const theses = await context.prisma.thesis.findMany({
		orderBy: {
			title: "asc"
		},
		include: {
			User: true,
			tags: {
				include: {
					tag: true
				}
			},
			Namespace: true
		}	
	});

	return theses.map(thesis => {
		return {
			id: thesis.id,
			title: thesis.title,
			studentName: thesis.studentName,
			supervisorName: thesis.supervisorName,
			summary: thesis.summary,
			...(thesis.report && {report: thesis.report.toString('base64')}),
			namespace: {
				name: thesis.Namespace.name,
			},
			user: {
				id: thesis.userId,
				name: thesis.User.name,
				username: thesis.User.username,
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
			User: true,
			tags: {
				include: {
					tag: true
				}
			},
			Namespace: true
		}
	});

	return {
		id: thesis.id,
		title: thesis.title,
		studentName: thesis.studentName,
		supervisorName: thesis.supervisorName,
		summary: thesis.summary,
		...(thesis.report && {report: thesis.report.toString('base64')}),
		namespace: {
			name: thesis.Namespace.name,
		},
		user: {
			id: thesis.userId,
			name: thesis.User.name,
			username: thesis.User.username,
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
	const cfgMapMetas = await coreAPI.getConfigMapMetasInNamespace(parent.name);

	const configMaps = cfgMapMetas.map(cfgMapMeta => <GQLConfigMap> {
		meta: cfgMapMeta
	});

	return configMaps;
}

export const allSecrets = async (parent, args: NamespacedObject, context, info): Promise<GQLSecret[]> => {
	const secretMetas = await coreAPI.getSecretMetasInNamespace(parent.name);

	const secrets = secretMetas.map(secretMeta => <GQLSecret> {
		meta: secretMeta
	});

	return secrets;
}