import { PrismaClient } from "@prisma/client";
import { GQLThesis, GQLUser } from "../schemaTypes";

export const id = async (parent: GQLUser, args, context, info) => {
	return parent.id;
}

export const name = async (parent: GQLUser, args, context, info) => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: parent.id
		}
	});

	return user.name;
}

export const username = async (parent:GQLUser, args, context, info) => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: parent.id
		}
	});

	return user.username;
}

export const role = async (parent:GQLUser, args, context: { prisma: PrismaClient}, info) => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: parent.id
		},
		include: {
			role: true
		}
	});

	return user.role;
}

export const thesis = async (parent:GQLUser, args, context: { prisma: PrismaClient}, info): Promise<GQLThesis> => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: parent.id
		},
		include: {
			thesis: {
				include: {
					namespace: true,
					user: true,
					tags: {
						include: {
							tag: true
						}
					}
				}
			}
		}
	});

	if (!user.thesis) {
		return null;
	}

	return {
		...(user.thesis),
		report: user.thesis.report ? user.thesis.report.toString('base64') : null,
		tags: user.thesis.tags.map(tag => {
			return {
				name: tag.tag.name,
			}
		})
	};
}
