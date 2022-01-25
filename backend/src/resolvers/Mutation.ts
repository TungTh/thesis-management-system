import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import * as yaml from 'js-yaml';
import jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { createDeployment as createDeploymentAPI, createStatefulSet as createStatefulSetAPI, deleteDeployment as deleteDeploymentAPI, deleteStatefulSet as deleteStatefulSetAPI, getDeploymentMetasInNamespace, getStatefulSetMetasInNamespace, scaleDeployment } from "../k8s/appAPI";
import { createConfigMap as createConfigMapAPI, createNamespace as createNamespaceAPI, createPersistentVolume as createPersistentVolumeAPI, createPersistentVolumeClaim as createPersistentVolumeClaimAPI, createSecret as createSecretAPI, createService as createServiceAPI, deleteConfigMap as deleteConfigMapAPI, deleteNamespace as deleteNamespaceAPI, deletePersistentVolume as deletePersistentVolumeAPI, deletePersistentVolumeClaim as deletePersistentVolumeClaimAPI, deleteSecret as deleteSecretAPI, deleteService as deleteServiceAPI, getConfigMapMetasInNamespace, getNamespaces, getPersistentVolumeClaimMetasInNamespace, getPersistentVolumeMetas, getSecretMetasInNamespace, getServiceMetasInNamespace } from "../k8s/coreAPI";
import { GQLAuthPayload, GQLConfigMap, GQLConfigMapInput, GQLDeployment, GQLDeploymentInput, GQLMutation, GQLNamespace, GQLPersistentVolume, GQLPersistentVolumeClaim, GQLPersistentVolumeClaimInput, GQLPersistentVolumeInput, GQLSecret, GQLSecretInput, GQLService, GQLServiceInput, GQLStatefulSetInput, GQLThesis, GQLThesisInput, GQLUserInput } from "../schemaTypes";
import { JWT_EXPIRY, JWT_SECRET, K8S_TIMEOUT, REFRESH_TOKEN_EXPIRY } from "../util/UtilConstant";

export const signup = async (parent, args: {user: GQLUserInput}, context: {res: any, prisma: PrismaClient}, info): Promise<GQLAuthPayload> => {
	if (!args.user.username || !args.user.password) {
		throw new Error('Username and password required');
	}

	let user = await context.prisma.user.findUnique({
		where: {
			username: args.user.username
		}
	});

	if (user) {
		throw new Error('Username already exists');
	}

	const password = await bcrypt.hash(args.user.password, 10);
	const refreshToken = uuid.v4();

	user = await context.prisma.user.create({
		data: {
			username: args.user.username,
			password: password,
			name: args.user.name,
			refreshToken: refreshToken,
			roleId: "0"
		}
	});

	context.res.cookie('refresh_token', refreshToken, { 
		httpOnly: true, 
		maxAge: REFRESH_TOKEN_EXPIRY * 60 * 1000,
		secure: true,
		sameSite: 'None' 
	})

	return {
		token: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY * 60 * 1000 }),
		user: user
	}
}

export const login = async (parent, args: {username: string, password: string}, context: {res: any, prisma: PrismaClient}, info): Promise<GQLAuthPayload> => {
	if (!args.username || !args.password) {
		throw new Error('Username and password required');
	}

	const user = await context.prisma.user.findUnique({
		where: {
			username: args.username
		}
	});

	if (!user) {
		throw new Error('Invalid username or password! Please try again.');
	}

	const valid = await bcrypt.compare(args.password, user.password);

	if (!valid) {
		throw new Error('Invalid username or password! Please try again.');
	}

	const refreshToken = uuid.v4();

	await context.prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			refreshToken: refreshToken
		}
	});

	context.res.cookie('refresh_token', refreshToken, {
		httpOnly: true,
		maxAge: REFRESH_TOKEN_EXPIRY * 60 * 1000,
		secure: true,
		sameSite: 'None'
	})

	return {
		token: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY * 60 * 1000 }),
		user: user
	}
}

export const logout = async (parent, args, context: {res: any, prisma: PrismaClient}, info): Promise<boolean> => {
	context.res.clearCookie('refresh_token');
	return true;
}

export const refreshJWT = async (parent, args, context: {req: any, res: any, prisma: PrismaClient, userId: string}, info): Promise<GQLAuthPayload> => {
	const cookies = context.req.cookies
	if (!cookies)
		throw new Error('Cookies not found! Please login!')

	const refreshToken = context.req.cookies['refresh_token']
	if (!refreshToken)
		throw new Error('No refresh token found! Please login!')

	const user = await context.prisma.user.findUnique({
		where: {
			refreshToken: refreshToken
		}
	});

	if (!user) {
		throw new Error('Invalid refresh token');
	}

	return {
		token: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY * 60 * 1000 }),
		user: user
	}
}

export const createNamespace = async (parent: GQLMutation, args: { name: string }, context: { prisma: PrismaClient, userId: string}): Promise<GQLNamespace> => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: context.userId
		}, 
		include: {
			role: true
		}
	});

	if (!user || user.role.name !== "Admin") {
		throw new Error('You are not authorized to create a namespace!');
	}


	const existingNamespaces = await getNamespaces();

	for (const ns of existingNamespaces) {
		if (ns.name === args.name) {
			throw new Error(`Namespace ${args.name} already exists`);
		}
	}
	const response = await context.prisma.namespace.create({
		data: {
			name: args.name
		}
	});
		
	if (response.name === args.name) {
		const namespace = await createNamespaceAPI(args.name);
		return namespace;
	}
    
	return null;
}

export const createDeployment = async (parent: GQLMutation, args: { namespace: string, deployment: GQLDeploymentInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLDeployment> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to create a deployment in this namespace!');
	}

	const existingDeployments = await getDeploymentMetasInNamespace(args.namespace);

	for (const dpl of existingDeployments) {
		if (dpl.name === args.deployment.name) {
			throw new Error(`Deployment ${args.deployment.name} already exists`);
		}
	}

	const response = await createDeploymentAPI(args.namespace, args.deployment);
	
	await storeYamlFile(context, {namespace: args.namespace, name: args.deployment.name}, response.yaml);

	return response;
}

export const createStatefulSet = async (parent: GQLMutation, args: { namespace: string, statefulSet: GQLStatefulSetInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLDeployment> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to create a stateful set in this namespace!');
	}

	const existingStatefulSets = await getStatefulSetMetasInNamespace(args.namespace);

	for (const sts of existingStatefulSets) {
		if (sts.name === args.statefulSet.name) {
			throw new Error(`StatefulSet ${args.statefulSet.name} already exists`);
		}
	}

	const response = await createStatefulSetAPI(args.namespace, args.statefulSet);
	
	await storeYamlFile(context, {namespace: args.namespace, name: args.statefulSet.name}, response.yaml);

	return response;
}

export const createService = async (parent: GQLMutation, args: { namespace: string, service: GQLServiceInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLService> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to create a service in this namespace!');
	}

	const existingServices = await getServiceMetasInNamespace(args.namespace);

	for (const svc of existingServices) {
		if (svc.name === args.service.name) {
			throw new Error(`Service ${args.service.name} already exists`);
		}
	}

	const response = await createServiceAPI(args.namespace, args.service);

	await storeYamlFile(context, {namespace: args.namespace, name: args.service.name}, response.yaml);

	return response;
}

export const createSecret = async (parent: GQLMutation, args: { namespace: string, secret: GQLSecretInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLSecret> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to create a secret in this namespace!');
	}

	const existingSecrets = await getSecretMetasInNamespace(args.namespace);

	for (const secret of existingSecrets) {
		if (secret.name === args.secret.name) {
			throw new Error(`Secret ${args.secret.name} already exists`);
		}
	}

	const response = await createSecretAPI(args.namespace, args.secret);

	await storeYamlFile(context, {namespace: args.namespace, name: args.secret.name}, response.yaml);

	return response;
}

export const createConfigMap = async (parent: GQLMutation, args: { namespace: string, configMap: GQLConfigMapInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLConfigMap> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to create a config map in this namespace!');
	}

	const existingConfigMaps = await getConfigMapMetasInNamespace(args.namespace);

	for (const cm of existingConfigMaps) {
		if (cm.name === args.configMap.name) {
			throw new Error(`ConfigMap ${args.configMap.name} already exists`);
		}
	}

	const response = await createConfigMapAPI(args.namespace, args.configMap);
	
	await storeYamlFile(context, {namespace: args.namespace, name: args.configMap.name}, response.yaml);

	return response;
}

export const createPersistentVolumeClaim = async (parent: GQLMutation, args: { namespace: string, persistentVolumeClaim: GQLPersistentVolumeClaimInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLPersistentVolumeClaim> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to create a persistent volume claim in this namespace!');
	}

	const existingPVCs = await getPersistentVolumeClaimMetasInNamespace(args.namespace);

	for (const pvc of existingPVCs) {
		if (pvc.name === args.persistentVolumeClaim.meta.name) {
			throw new Error(`PersistentVolumeClaim ${args.persistentVolumeClaim.meta.name} already exists`);
		}
	}

	const response = await createPersistentVolumeClaimAPI(args.namespace, args.persistentVolumeClaim);

	return response;
}

export const createPersistentVolume = async (parent: GQLMutation, args: { persistentVolume: GQLPersistentVolumeInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLPersistentVolume> => {
	if (!userIsAdmin(context)) {
		throw new Error('You are not authorized to create a persistent volume!');
	}
	
	const existingPVs = await getPersistentVolumeMetas();

	for (const pv of existingPVs) {
		if (pv.name === args.persistentVolume.meta.name) {
			throw new Error(`PersistentVolume ${args.persistentVolume.meta.name} already exists`);
		}
	}

	const response = await createPersistentVolumeAPI(args.persistentVolume);

	return response;
}


export const createThesis = async (parent: GQLMutation, args: { thesis: GQLThesisInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLThesis> => {
	if (!context.userId) {
		throw new Error('You are not authorized to create a thesis!');
	}

	const user = await context.prisma.user.findUnique({
		where: {
			id: context.userId
		},
		include: {
			thesis: true
		}
	});

	if (user.thesis) {
		throw new Error('You already have a thesis!');
	}

	const namespace = await context.prisma.namespace.findUnique({
		where: {
			name: args.thesis.namespace
		},
		include: {
			thesis: true
		}
	});

	if (!namespace) {
		throw new Error('Namespace does not exist! Please contact an administrator to get a namespace.');
	}

	if (namespace.thesis) {
		throw new Error('This namespace already has a thesis!');
	}

	const thesis = await context.prisma.thesis.create({
		data: {
			studentName: args.thesis.studentName,
			studentID: args.thesis.studentID,
			supervisorName: args.thesis.supervisorName,
			semester: args.thesis.semester,
			title: args.thesis.title,
			summary: args.thesis.summary,
			report: Buffer.from(args.thesis.report, 'base64'),
			namespace: {
				connect: {
					name: args.thesis.namespace
				}
			},
			user: {
				connect: {
					id: context.userId
				}
			},
		}, 
		include: {
			user: true,
			namespace: true
		}
	});

	const tagIds = await Promise.all(args.thesis.tags.map(async tag => {
		let t = await context.prisma.thesisTag.findUnique({
			where: {
				name: tag.name
			}
		});
		
		if (!t) {
			t = await context.prisma.thesisTag.create({
				data: {
					name: tag.name
				}
			});
		}

		return t.id;
	}));

	await context.prisma.tagOnThesis.createMany({
		data: tagIds.map(id => ({
			thesisId: thesis.id,
			tagId: id
		}))
	});

	return {
		...thesis,
		report: thesis.report && thesis.report.toString('base64')
	};
}

export const updateThesis = async (parent: GQLMutation, args: { id: string, thesis: GQLThesisInput }, context: { prisma: PrismaClient, userId: string }): Promise<GQLThesis> => {
	const thesis = await context.prisma.thesis.findUnique({
		where: {
			id: args.id
		},
		include: {
			user: true,
			namespace: true,
			tags: true
		}
	});

	if (!thesis) {
		throw new Error('Thesis not found!');
	}

	if (thesis.user.id !== context.userId) {
		throw new Error('You are not authorized to update this thesis!');
	}

	const namespace = await context.prisma.namespace.findUnique({
		where: {
			name: args.thesis.namespace
		},
		include: {
			thesis: true
		}
	});

	if (namespace.thesis && namespace.thesis.id !== thesis.id) {
		throw new Error('This namespace already has a thesis!');
	}

	const tagIds = await Promise.all(args.thesis.tags.map(async tag => {
		let t = await context.prisma.thesisTag.findUnique({
			where: {
				name: tag.name
			}
		});

		if (!t) {
			t = await context.prisma.thesisTag.create({
				data: {
					name: tag.name
				}
			});
		}

		return t.id;
	}));

	await context.prisma.tagOnThesis.deleteMany({
		where: {
			thesisId: thesis.id
		}
	});

	await context.prisma.tagOnThesis.createMany({
		data: tagIds.map(id => ({
			thesisId: thesis.id,
			tagId: id
		}))
	});

	const updatedThesis = await context.prisma.thesis.update({
		where: {
			id: args.id
		},
		data: {
			studentName: args.thesis.studentName,
			supervisorName: args.thesis.supervisorName,
			title: args.thesis.title,
			summary: args.thesis.summary,
			report: Buffer.from(args.thesis.report, 'base64'),
			...(namespace.name !== args.thesis.namespace && {namespace: {
				connect: {
					name: args.thesis.namespace
				}
			}})
		},
		include: {
			user: true,
			namespace: true
		}
	});

	return {
		...updatedThesis,
		report: updatedThesis.report && updatedThesis.report.toString('base64')
	};	
}

export const deleteThesis = async (parent: GQLMutation, args: { id: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	const thesis = await context.prisma.thesis.findUnique({
		where: {
			id: args.id
		},
		include: {
			user: true,
			namespace: true
		}
	});

	if (!thesis) {
		throw new Error('Thesis not found!');
	}

	if (thesis.user.id !== context.userId) {
		throw new Error('You are not authorized to delete this thesis!');
	}

	await context.prisma.thesis.delete({
		where: {
			id: args.id
		}
	});

	return true;
}

export const deleteNamespace = async (parent: GQLMutation, args: { name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: context.userId
		},
		include: {
			role: true
		}
	});

	console.log({user})

	if (!user || user.role.name !== 'Admin') {
		throw new Error('You are not authorized to delete this namespace!');
	}

	const namespace = await context.prisma.namespace.findUnique({
		where: {
			name: args.name
		},
		include: {
			thesis: true
		}
	});

	if (!namespace) {
		throw new Error('Namespace not found!');
	}

	if (namespace.thesis) {
		throw new Error('This namespace has a thesis! Please first remove the thesis!');
	}

	await deleteNamespaceAPI(args.name);

	const ns = await context.prisma.namespace.delete({
		where: {
			name: args.name
		}
	});

	if (!ns) {
		throw new Error('Could not delete namespace! Please contact an administrator!');
	}

	return true;
}

export const deleteDeployment = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to delete this deployment!');
	}
	
	const deployment = await deleteDeploymentAPI(args.namespace, args.name);

	if (!deployment) {
		throw new Error('Could not delete deployment! Please contact an administrator!');
	}

	return true;
}

export const deleteStatefulSet = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to delete this stateful set!');
	}

	const statefulSet = await deleteStatefulSetAPI(args.namespace, args.name);

	if (!statefulSet) {
		throw new Error('Could not delete stateful set! Please contact an administrator!');
	}

	return true;
}

export const deleteService = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to delete this service!');
	}

	const service = await deleteServiceAPI(args.namespace, args.name);

	if (!service) {
		throw new Error('Could not delete service! Please contact an administrator!');
	}

	return true;
}

export const deleteConfigMap = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to delete this config map!');
	}

	const configMap = await deleteConfigMapAPI(args.namespace, args.name);

	if (!configMap) {
		throw new Error('Could not delete config map! Please contact an administrator!');
	}

	return true;
}

export const deleteSecret = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userOwnNamespace(context, args.namespace)) {
		throw new Error('You are not authorized to delete this secret!');
	}

	const secret = await deleteSecretAPI(args.namespace, args.name);

	if (!secret) {
		throw new Error('Could not delete secret! Please contact an administrator!');
	}

	return true;
}

export const deletePersistentVolume = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userIsAdmin(context)) {
		throw new Error('You are not authorized to delete this persistent volume!');
	}

	const persistentVolume = await deletePersistentVolumeAPI(args.name);

	if (!persistentVolume) {
		throw new Error('Could not delete persistent volume! Please contact an administrator!');
	}

	return true;
	
}

export const deletePersistentVolumeClaim = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userIsAdmin(context)) {
		throw new Error('You are not authorized to delete this persistent volume claim!');
	}

	const persistentVolumeClaim = await deletePersistentVolumeClaimAPI(args.namespace, args.name);

	if (!persistentVolumeClaim) {
		throw new Error('Could not delete persistent volume claim! Please contact an administrator!');
	}

	return true;
}

export const deleteUser = async (parent: GQLMutation, args: { id: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	if (!userIsAdmin(context)) {
		throw new Error('You are not authorized to delete this user!');
	}

	const user = await context.prisma.user.findUnique({
		where: {
			id: args.id
		},
	});

	if (!user) {
		throw new Error('User not found!');
	}

	const deletedUser = await context.prisma.user.update({
		where: {
			id: args.id
		},
		data: {
			active: false
		}
	});

	if (!deletedUser) {
		throw new Error('Could not delete user! Please contact an administrator!');
	}

	return true;
}


export const startDeployment = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	const success = await scaleDeployment(args.namespace, args.name, 1);

	if (!success) {
		throw new Error('Could not start deployment! Please contact an administrator!');
	}

	setTimeout(scaleDeployment, K8S_TIMEOUT, args.namespace, args.name, 0);

	return true;
}

export const stopDeployment = async (parent: GQLMutation, args: { namespace: string, name: string }, context: { prisma: PrismaClient, userId: string }): Promise<boolean> => {
	const success = await scaleDeployment(args.namespace, args.name, 0);

	if (!success) {
		throw new Error('Could not stop deployment! Please contact an administrator!');
	}

	return true;
}


async function userOwnNamespace(context:{ prisma: PrismaClient, userId:	string }, namespace: string): Promise<boolean> {
	const ns = await context.prisma.namespace.findUnique({
		where: {
			name: namespace
		}
	});

	if (!ns || !context.userId) {
		return false;
	}

	const user = await context.prisma.user.findUnique({
		where: {
			id: context.userId
		},
		include: {
			role: {
				select: {
					name: true
				}
			}
		}
	});

	if (!user) {
		return false;
	}

	if (user.role.name === 'Admin') {
		return true;
	}

	const thesis = await context.prisma.thesis.findFirst({
		where: {
			id: context.userId,
			namespaceId: ns.id
		}
	});

	return !!thesis;
}

async function userIsAdmin(context: { prisma: PrismaClient, userId: string }): Promise<boolean> {
	const user = await context.prisma.user.findUnique({
		where: {
			id: context.userId
		},
		include: {
			role: {
				select: {
					name: true
				}
			}
		}
	});

	if (!user) {
		return false;
	}

	return user.role.name === 'Admin';
}

async function storeYamlFile(context: { prisma: PrismaClient; }, args: { namespace: string; name: string; }, yamlString: string) {
	const namespace = await context.prisma.namespace.findUnique({
		where: {
			name: args.namespace
		}
	});

	if (!namespace) {
		throw new Error(`Namespace ${args.namespace} does not exist`);
	}
	
	const yamlFile = yaml.load(yamlString);
	await context.prisma.kubeFile.create({
		data: {
			name: `${args.name}-dpl.yaml`,
			namespaceId: namespace.id,
			content: JSON.stringify(yamlFile)
		}
	});
}

