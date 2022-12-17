import express from "express";
import { config } from "dotenv";
import { GetusersController } from "./controllers/get-users/get-users";
import { PrismaGetUsersRepository } from "./repositories/get-users/prisma-get-users";
config();

const app = express();

const port = process.env.PORT || 3000;

app.get("/users", async (req, res) => {
  const prismaGetUsersRepository = new PrismaGetUsersRepository();
  const getusersController = new GetusersController(prismaGetUsersRepository);
  const { statusCode, body } = await getusersController.handle();
  res.status(statusCode).json(body);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
