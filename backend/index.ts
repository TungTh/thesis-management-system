import { getPodNames } from './k8sConnector';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors'

const app = express();
const PORT = 1234;

app.use(cors())

app.get('/', async (req: Request, res: Response) => {
	try {
		res.send(JSON.stringify(await getPodNames()));
	} catch (err) {
		console.error(err);
		res.send("Cannot get pods information. Cluster might not be running.");
	}
})

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
})