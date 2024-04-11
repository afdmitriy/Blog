import { OutputCommentType } from './output.comment.model';

export type OutputCommentsWithQuery = {
   pagesCount: number;
   page: number;
   pageSize: number;
   totalCount: number;
   items: OutputCommentType[];
};
