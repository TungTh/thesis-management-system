import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import * as yaml from 'js-yaml';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { createDeployment as createDeploymentAPI, createStatefulSet as createStatefulSetAPI, getDeploymentMetasInNamespace, getStatefulSetMetasInNamespace } from "../k8s/appAPI";
import { createConfigMap as createConfigMapAPI, createNamespace as createNamespaceAPI, createSecret as createSecretAPI, createService as createServiceAPI, getConfigMapMetasInNamespace, getNamespaces, getSecretMetasInNamespace, getServiceMetasInNamespace } from "../k8s/coreAPI";
import { GQLAuthPayload, GQLConfigMap, GQLConfigMapInput, GQLDeployment, GQLDeploymentInput, GQLMutation, GQLNamespace, GQLSecret, GQLSecretInput, GQLService, GQLServiceInput, GQLStatefulSetInput, GQLUserInput } from "../schemaTypes";
import { JWT_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../util/UtilConstant";

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
		token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY * 60 * 1000 }),
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
		token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY * 60 * 1000 }),
		user: user
	}
}

export const logout = async (parent, args, context: {res: any, prisma: PrismaClient}, info): Promise<boolean> => {
	context.res.clearCookie('refresh_token');
	return true;
}

export const refreshJWT = async (parent, args: {refreshToken: string}, context: {res: any, prisma: PrismaClient}, info): Promise<GQLAuthPayload> => {
	const user = await context.prisma.user.findUnique({
		where: {
			refreshToken: args.refreshToken
		}
	});

	if (!user) {
		throw new Error('Invalid refresh token');
	}

	return {
		token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY * 60 * 1000 }),
		user: user
	}
}

export const createNamespace = async (parent: GQLMutation, args: { name: string }, context: { prisma: PrismaClient}): Promise<GQLNamespace> => {
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

export const createDeployment = async (parent: GQLMutation, args: { namespace: string, deployment: GQLDeploymentInput }, context: { prisma: PrismaClient }): Promise<GQLDeployment> => {
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

export const createStatefulSet = async (parent: GQLMutation, args: { namespace: string, statefulSet: GQLStatefulSetInput }, context: { prisma: PrismaClient }): Promise<GQLDeployment> => {
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

export const createService = async (parent: GQLMutation, args: { namespace: string, service: GQLServiceInput }, context: { prisma: PrismaClient }): Promise<GQLService> => {
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

export const createSecret = async (parent: GQLMutation, args: { namespace: string, secret: GQLSecretInput }, context: { prisma: PrismaClient }): Promise<GQLSecret> => {
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

export const createConfigMap = async (parent: GQLMutation, args: { namespace: string, configMap: GQLConfigMapInput }, context: { prisma: PrismaClient }): Promise<GQLConfigMap> => {
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

