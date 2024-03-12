import { Router, Response } from 'express';
import {
   ParamType,
   RequestWithBody,
   RequestWithParams,
   RequestWithQuery,
} from '../models/common';
import { GetUserQueryModel } from '../models/users/input/get.users.query.model';
import { authMiddleware } from '../middlewares/auth/auth-midddleware';
import { usersValidation } from '../validators/users.validators';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { ObjectId } from 'mongodb';
import { PostUserModel } from '../models/users/input/post.users.model';

export const userRoute: Router = Router({});

userRoute.get(
   '/',
   authMiddleware,
   async (req: RequestWithQuery<GetUserQueryModel>, res: Response) => {
      const users = await UserService.getAllUsers(req.query);

      res.status(200).send(users);
      return;
   }
);

userRoute.post(
   '/',
   authMiddleware,
   usersValidation(),
   async (req: RequestWithBody<PostUserModel>, res: Response) => {
      const user = await UserService.createUser(req.body);

      if (!user) {
         res.sendStatus(404);
         return;
      }

      res.status(201).send(user);
      return;
   }
);

userRoute.delete(
   '/:id',
   authMiddleware,
   async (req: RequestWithParams<ParamType>, res: Response) => {
      if (!ObjectId.isValid(req.params.id)) {
         res.sendStatus(404);
         return;
      }

      const isDelited = await UserRepository.deleteUserById(req.params.id);

      if (!isDelited) {
         res.sendStatus(404);
         return;
      }

      res.sendStatus(204);
      return;
   }
);
