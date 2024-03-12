export type GetUserQueryModel = {
   searchLoginTerm?: string | null;
   searchEmailTerm?: string | null;
   sortBy?: string;
   sortDirection?: 'desc' | 'asc';
   pageNumber?: number;
   pageSize?: number;
};
