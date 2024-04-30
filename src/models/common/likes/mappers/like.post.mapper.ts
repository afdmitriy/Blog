import { WithId } from 'mongodb';
import { LikePostDB } from '../like.post.db.type';
import { LikePostOutputType } from '../output/lilke.post.output.type';

export const likePostMapper = (like: WithId<LikePostDB>): LikePostOutputType => {
   return {
      id: like._id.toString(),
      userId: like.userId,
      postId: like.postId,
      createdAt: like.createdAt.toISOString(),
      likeStatus: like.likeStatus
   };
};