import { WithId } from 'mongodb';
import { LikeCommentDB } from '../like.comment.db.type';
import { LikeCommentOutputType } from '../output/like.comment.output.type';


export const likeCommentMapper = (like: WithId<LikeCommentDB>): LikeCommentOutputType => {
   return {
      id: like._id.toString(),
      userId: like.userId,
      commentId: like.commentId,
      createdAt: like.createdAt.toISOString(),
      likeStatus: like.likeStatus
   };
};
