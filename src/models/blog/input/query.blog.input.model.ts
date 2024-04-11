export type QueryBlogInputModel = {
   searchNameTerm?: string;
   sortBy?: string;
   sortDirection?: 'desc' | 'asc';
   pageNumber?: number;
   pageSize?: number;
};
