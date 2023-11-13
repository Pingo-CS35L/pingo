import express from 'express';
import bodyParser from 'body-parser';
import { testRouter } from './routes/testRoutes.js';
import { userRouter } from './routes/userRoutes.js';

// Port that the server API is listening to
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/test", testRouter);
app.use("/user", userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});