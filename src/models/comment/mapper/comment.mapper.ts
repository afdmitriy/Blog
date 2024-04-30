import { WithId } from 'mongodb';
import { CommentDB } from '../db/comment.db';
import { OutputCommentType } from '../output/output.comment.model';

export const commentMapper = (
   comment: WithId<CommentDB>
): OutputCommentType => {
   return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
   };
};
