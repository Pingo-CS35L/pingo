import express from 'express';
import bodyParser from 'body-parser';
import { testRouter } from './routes/testRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { getLocalIP } from './serverConfig.js';

// Port that the server API is listening to
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/test", testRouter);
app.use("/user", userRouter);

const ipAddress = await getLocalIP();
// // Start the server
// app.listen(0, () => {
//     const { port, address } = app.address();
//     console.log(`Server running at http://${address}:${port}/`);
// });

const server = app.listen(0, async () => {
    const { port } = server.address();
    const ipAddress = await getLocalIP(); // Assuming getLocalIP is an async function

    console.log(`Server running at http://${ipAddress}:${port}/`);
});