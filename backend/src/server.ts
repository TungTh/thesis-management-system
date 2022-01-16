import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
// import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as Deployment from './resolvers/Deployment';
import * as Mutation from './resolvers/Mutation';
import * as Namespace from './resolvers/Namespace';
import * as Pod from './resolvers/Pod';
// const prisma = new PrismaClient();
import * as Query from './resolvers/Query';
import * as StatefulSet from './resolvers/StatefulSet';



const resolvers = {
	Query,
	Mutation,
	Namespace,
	Pod,
	Deployment,
	StatefulSet,
}

const server = new ApolloServer({
	typeDefs: fs.readFileSync(path.join(__dirname, 'resources/schema.graphql'), 'utf-8'),
	resolvers,
	context: ({req, res}) => {
		return {
			...req,
			...res,
			// prisma,
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
