import { LikeCommentModelClass } from '../db/db';
import { LikeStatusEnum } from '../models/common/enums';
import { LikeCommentDB } from '../models/common/likes/like.comment.db.type';
import { LikePostDB } from '../models/common/likes/like.post.db.type';
import { UsersDB } from '../models/users/db/users.db';
import { GetUserQueryModel } from '../models/users/input/get.users.query.model';
import { PostUserModel } from '../models/users/input/post.users.model';
import { OutputUserType } from '../models/users/output/output.user.type';
import { OutputUsersWithQuery } from '../models/users/output/output.users.query.type';
import { LikeCommentRepository } from '../repositories/like.comment.repository';
import { LikePostRepository } from '../repositories/like.post.repository';
import { UserQueryRepository } from '../repositories/user.query.repository';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';

type UserParams = {
   searchLoginTerm: string | null;
   searchEmailTerm: string | null;
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
};

type LikeCommentData = {
   userId: string;
   commentId: string;
   likeStatus: LikeStatusEnum;
}

type LikePostData = {
   userId: string;
   postId: string;
   likeStatus: LikeStatusEnum;
}

export class UserService {
   static async getAllUsers(
      queryParams: GetUserQueryModel
   ): Promise<OutputUsersWithQuery | false | null> {
      const userParams: UserParams = {
         searchLoginTerm: queryParams.searchLoginTerm ?? null,
         searchEmailTerm: queryParams.searchEmailTerm ?? null,
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };

      try {
         const users = await UserQueryRepository.getAllUsers(userParams);

         if (!users) {
            return null;
         }

         return users;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async createUser(
      userData: PostUserModel
   ): Promise<OutputUserType | false | null> {
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(
         userData.password,
         passwordSalt
      );

      const newUser: UsersDB = {
         login: userData.login,
         email: userData.email,
         createdAt: new Date().toISOString(),
         passwordHash: passwordHash,
         passwordSalt: passwordSalt,
      };

      const user = await UserRepository.createUser(newUser);

      if (!user) {
         return null;
      }

      return user;
   }

   static async _generateHash(password: string, salt: string) {
      const hash = await bcrypt.hash(password, salt);
      return hash;
   }

   static async checkCredentials(loginOrEmail: string, password: string) {
      const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail);
      if (!user) return false;

      const passwordHash = await this._generateHash(
         password,
         user.passwordSalt
      );

      if (passwordHash !== user.passwordHash) {
         return false;
      }

      return true;
   }

   static async setNewUserPassword(
      userId: string,
      newPassword: string
   ): Promise<boolean> {
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(newPassword, passwordSalt);

      const user = await UserRepository.updateUserPassword(
         userId,
         passwordHash,
         passwordSalt
      )
      return user
   }  
   
   static async updateLikeStatusForComment(likeData: LikeCommentData): Promise<boolean> {
      const like = await LikeCommentRepository.findLikeByCommentIdAndUserId(likeData.commentId, likeData.userId)
      if (!like) {
         const likeCommentData: LikeCommentDB = {
            userId: likeData.userId,
            commentId: likeData.commentId,
            createdAt: new Date(),
            likeStatus: likeData.likeStatus
         }
         const isCreated = await LikeCommentRepository.createLikeForComment(likeCommentData)
         if (!isCreated) {
            console.log("In UserService Like not created")
            return false
         }
         const newLike = await LikeCommentRepository.findLikeByCommentIdAndUserId(likeData.commentId, likeData.userId)
      
         if (!newLike) {
            console.log("In UserService Like not found")
            return false
         } 
         await LikeCommentRepository.updateLikeStatus(newLike.id, likeData.likeStatus)
         return true
      }

      await LikeCommentRepository.updateLikeStatus(like.id, likeData.likeStatus)

      return true
   }
   
   static async updateOrCreateLikeStatusForPost(likeData: LikePostData): Promise<boolean> {
      const like = await LikePostRepository.findLikeByPostIdAndUserId(likeData.postId, likeData.userId)
      if (!like) {
         const likePostData: LikePostDB = {
            userId: likeData.userId,
            postId: likeData.postId,
            createdAt: new Date(),
            likeStatus: likeData.likeStatus
         }
         const isCreated = await LikePostRepository.createLikeForComment(likePostData)
         if (!isCreated) {
            console.log("In UserService Like not created")
            return false
         }
         const newLike = await LikePostRepository.findLikeByPostIdAndUserId(likeData.postId, likeData.userId)
      
         if (!newLike) {
            console.log("In UserService Like not found")
            return false
         } 
         await LikePostRepository.updateLikeStatus(newLike.id, likeData.likeStatus)
         return true
      }

      await LikePostRepository.updateLikeStatus(like.id, likeData.likeStatus)

      return true
   }


}
