import { OutputCommentWithLikeType } from './output.comment.with.like.model';

export type OutputCommentsWithQuery = {
   pagesCount: number;
   page: number;
   pageSize: number;
   totalCount: number;
   items: OutputCommentWithLikeType[];
};
