import Prisma from '@prisma/client';
import Apollo from 'apollo-server-express';
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as Deployment from './resolvers/Deployment';
import * as Mutation from './resolvers/Mutation';
import * as Namespace from './resolvers/Namespace';
import * as Pod from './resolvers/Pod';
import * as Query from './resolvers/Query';
import * as StatefulSet from './resolvers/StatefulSet';
import * as Service from './resolvers/Service';
import * as Secret from './resolvers/Secret';
import * as ConfigMap from './resolvers/ConfigMap';

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
	ConfigMap
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
		}
	}
});

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 4000;

server.applyMiddleware({app});

app.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
})
