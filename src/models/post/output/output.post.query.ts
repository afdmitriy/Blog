import { OutputPostWithLikeType } from './output.post.with.like.model';

export type OutputPoststsWithQuery = {
   pagesCount: number;
   page: number;
   pageSize: number;
   totalCount: number;
   items: OutputPostWithLikeType[];
};
