import express from "express";
import { config } from "dotenv";
import { GetUsersController } from "./controllers/get-users/get-users";
import { PrismaGetUsersRepository } from "./repositories/get-users/prisma-get-users";
import { PrismaCreateUserRepository } from "./repositories/create-user/prisma-create-user";
import { CreateUserController } from "./controllers/create-user/create-user";
import { PrismaUpdateUserRepository } from "./repositories/update-user/prisma-update-user";
import { UpdateUserController } from "./controllers/update-user/update-user";
config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/users", async (req, res) => {
  const prismaGetUsersRepository = new PrismaGetUsersRepository();
  const getusersController = new GetUsersController(prismaGetUsersRepository);
  const { statusCode, body } = await getusersController.handle();
  res.status(statusCode).send(body);
});

app.post("/users", async (req, res) => {
  const prismaCreateUserRepository = new PrismaCreateUserRepository();
  const createUserController = new CreateUserController(
    prismaCreateUserRepository
  );

  const { statusCode, body } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

app.patch("/users/:id", async (req, res) => {
  const prismaUpdateUserRepository = new PrismaUpdateUserRepository();
  const updateUserController = new UpdateUserController(
    prismaUpdateUserRepository
  );

  const { statusCode, body } = await updateUserController.handle({
    params: req.params,
    body: req.body,
  });

  res.status(statusCode).send(body);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
