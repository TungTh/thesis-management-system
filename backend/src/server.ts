import Prisma from '@prisma/client';
import Apollo from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as ConfigMap from './resolvers/ConfigMap';
import * as Deployment from './resolvers/Deployment';
import * as Mutation from './resolvers/Mutation';
import * as Namespace from './resolvers/Namespace';
import * as PersistentVolume from './resolvers/PersistentVolume';
import * as PersistentVolumeClaim from './resolvers/PersistentVolumeClaim';
import * as Pod from './resolvers/Pod';
import * as Query from './resolvers/Query';
import * as Secret from './resolvers/Secret';
import * as Service from './resolvers/Service';
import * as StatefulSet from './resolvers/StatefulSet';
import * as User from './resolvers/User';
import { getUserId, getUserRoleId } from './util/AuthUtils';

const { ApolloServer } = Apollo;
const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

const resolvers = {
	Query,
	Mutation,
	Namespace,
	Pod,
	Deployment,
	StatefulSet,
	Service,
	Secret,
	ConfigMap,
	User,
	PersistentVolume,
	PersistentVolumeClaim
}

const __dirname = path.resolve();

const server = new ApolloServer({
	typeDefs: fs.readFileSync(path.join(__dirname, 'src/resources/schema.graphql'), 'utf-8'),
	resolvers,
	context: ({req, res}) => {
		return {
			...req,
			...res,
			prisma,
			userId:
				req && req.headers.authorization
					? getUserId(req)
					: null,
			roleId:
				req && req.headers.authorization
					? getUserRoleId(req)
					: null
		}
	}
});

const app = express();
app.disable('x-powered-by');

app.use(cookieParser())

const PORT = process.env.PORT || 4000;

const corsOptions = {
	origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization']
}

server.applyMiddleware({app, cors: corsOptions});

app.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
})

