import { OutputUserType } from './output.user.type';

export type OutputUsersWithQuery = {
   pagesCount: number;
   page: number;
   pageSize: number;
   totalCount: number;
   items: OutputUserType[];
};
