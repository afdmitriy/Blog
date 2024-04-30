import { PostService } from '../../../services/post.service';
import { Pagination } from '../../common';
import { OutputPoststsWithQuery } from '../output/output.post.query';
import { OutputPostType } from '../output/outputPostModel';

export const postAddLikesInfoMapper = async (
   post: Pagination<OutputPostType>, userId?: string
): Promise<OutputPoststsWithQuery> => {
   
   const itemsWithLikes = post.items.map(item =>
      PostService.makeLikesInfo(item.id, userId).then(extendedLikesInfo => ({
         ...item,
         extendedLikesInfo
      }))
   );

   // Ожидаем завершения всех промисов
   const items = await Promise.all(itemsWithLikes);

   return {
      pagesCount: post.pagesCount,
      page: post.page,
      pageSize: post.pageSize,
      totalCount: post.totalCount,
      items
   };

};
