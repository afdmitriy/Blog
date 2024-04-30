import { CommentService } from '../../../services/comment.service';
import { Pagination } from '../../common';
import { OutputCommentType } from '../output/output.comment.model';
import { OutputCommentsWithQuery } from '../output/output.comment.query';

export const commentAddLikesInfoMapper = async (
   comment: Pagination<OutputCommentType>, userId?: string
): Promise<OutputCommentsWithQuery> => {
   
   const itemsWithLikes = comment.items.map(item =>
      CommentService.makeLikesInfo(item.id, userId).then(likesInfo => ({
         ...item,
         likesInfo
      }))
   );

   // Ожидаем завершения всех промисов
   const items = await Promise.all(itemsWithLikes);

   return {
      pagesCount: comment.pagesCount,
      page: comment.page,
      pageSize: comment.pageSize,
      totalCount: comment.totalCount,
      items
   };

};