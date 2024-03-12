export type CommentDB = {
   content: string;
   postId: string;
   commentatorInfo: {
      userId: string;
      userLogin: string;
   };
   createdAt: string;
};
