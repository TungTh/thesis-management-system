import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import * as yaml from 'js-yaml';
import jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { createDeployment as createDeploymentAPI, createStatefulSet as createStatefulSetAPI, getDeploymentMetasInNamespace, getStatefulSetMetasInNamespace } from "../k8s/appAPI";
import { createConfigMap as createConfigMapAPI, createNamespace as createNamespaceAPI, createSecret as createSecretAPI, createService as createServiceAPI, getConfigMapMetasInNamespace, getNamespaces, getSecretMetasInNamespace, getServiceMetasInNamespace } from "../k8s/coreAPI";
import { GQLAuthPayload, GQLConfigMap, GQLConfigMapInput, GQLDeployment, GQLDeploymentInput, GQLMutation, GQLNamespace, GQLSecret, GQLSecretInput, GQLService, GQLServiceInput, GQLStatefulSetInput, GQLUserInput } from "../schemaTypes";
import { JWT_EXPIRY, JWT_SECRET, REFRESH_TOKEN_EXPIRY } from "../util/UtilConstant";

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

// export const createThesis = 

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

async function userOwnNamespace(context:{ prisma: PrismaClient, userId:	string }, namespace: string): Promise<boolean> {
	const ns = await context.prisma.namespace.findUnique({
		where: {
			name: namespace
		}
	});

	if (!ns) {
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

	const thesis = await context.prisma.thesis.findUnique({
		where: {
			id: context.userId,
			namespaceId: ns.id
		}
	});

	return !!thesis;
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

