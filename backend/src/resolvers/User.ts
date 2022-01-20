import { GQLUser } from "../schemaTypes";

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

export const role = async (parent:GQLUser, args, context, info) => {
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

export const thesis = async (parent:GQLUser, args, context, info) => {
	const user = await context.prisma.user.findUnique({
		where: {
			id: parent.id
		},
		include: {
			thesis: true
		}
	});

	user.thesis && user.thesis.forEach(thesis => {
		thesis.report = thesis.report.toString('base64');
	});

	return user.thesis;
}
