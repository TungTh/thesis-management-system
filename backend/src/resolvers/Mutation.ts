import { PrismaClient } from "@prisma/client";
import * as yaml from 'js-yaml';
import { createDeployment as createDeploymentAPI, createStatefulSet as createStatefulSetAPI, getDeploymentMetasInNamespace, getStatefulSetMetasInNamespace } from "../k8s/appAPI";
import { createConfigMap as createConfigMapAPI, createNamespace as createNamespaceAPI, createSecret as createSecretAPI, createService as createServiceAPI, getConfigMapMetasInNamespace, getNamespaces, getSecretMetasInNamespace, getServiceMetasInNamespace } from "../k8s/coreAPI";
import { GQLConfigMap, GQLConfigMapInput, GQLDeployment, GQLDeploymentInput, GQLMutation, GQLNamespace, GQLSecret, GQLSecretInput, GQLService, GQLServiceInput, GQLStatefulSetInput } from "../schemaTypes";

export const createNamespace = async (parent: GQLMutation, args: { name: string }, context: { prisma: PrismaClient}, info): Promise<GQLNamespace> => {
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

export const createDeployment = async (parent: GQLMutation, args: { namespace: string, deployment: GQLDeploymentInput }, context: { prisma: PrismaClient }, info): Promise<GQLDeployment> => {
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

export const createStatefulSet = async (parent: GQLMutation, args: { namespace: string, statefulSet: GQLStatefulSetInput }, context: { prisma: PrismaClient }, info): Promise<GQLDeployment> => {
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

export const createService = async (parent: GQLMutation, args: { namespace: string, service: GQLServiceInput }, context: { prisma: PrismaClient }, info): Promise<GQLService> => {
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

export const createSecret = async (parent: GQLMutation, args: { namespace: string, secret: GQLSecretInput }, context: { prisma: PrismaClient }, info): Promise<GQLSecret> => {
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

export const createConfigMap = async (parent: GQLMutation, args: { namespace: string, configMap: GQLConfigMapInput }, context: { prisma: PrismaClient }, info): Promise<GQLConfigMap> => {
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

