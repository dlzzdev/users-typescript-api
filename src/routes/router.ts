import { Router, Request, Response } from "express";
import { CreateUserController } from "../controllers/create-user/create-user";
import { DeleteUserController } from "../controllers/delete-user/delete-user";
import { GetUsersController } from "../controllers/get-users/get-users";
import { UpdateUserController } from "../controllers/update-user/update-user";
import { PrismaCreateUserRepository } from "../repositories/create-user/prisma-create-user";
import { PrismaDeleteUserRepository } from "../repositories/delete-user/prisma-delete-user";
import { PrismaGetUsersRepository } from "../repositories/get-users/prisma-get-users";
import { PrismaUpdateUserRepository } from "../repositories/update-user/prisma-update-user";

export const router = Router()
  .get("/users", async (req: Request, res: Response) => {
    const prismaGetUsersRepository = new PrismaGetUsersRepository();
    const getusersController = new GetUsersController(prismaGetUsersRepository);
    const { statusCode, body } = await getusersController.handle();
    res.status(statusCode).send(body);
  })
  .post("/users", async (req: Request, res: Response) => {
    const prismaCreateUserRepository = new PrismaCreateUserRepository();
    const createUserController = new CreateUserController(
      prismaCreateUserRepository
    );

    const { statusCode, body } = await createUserController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  })
  .patch("/users/:id", async (req: Request, res: Response) => {
    const prismaUpdateUserRepository = new PrismaUpdateUserRepository();
    const updateUserController = new UpdateUserController(
      prismaUpdateUserRepository
    );

    const { statusCode, body } = await updateUserController.handle({
      params: req.params,
      body: req.body,
    });

    res.status(statusCode).send(body);
  })
  .delete("/users/:id", async (req: Request, res: Response) => {
    const prismaDeleteUserRepository = new PrismaDeleteUserRepository();
    const deleteUserController = new DeleteUserController(
      prismaDeleteUserRepository
    );

    const { statusCode, body } = await deleteUserController.handle({
      params: req.params,
    });

    res.status(statusCode).send(body);
  });
