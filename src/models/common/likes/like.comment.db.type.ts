import { LikeStatusEnum } from "../enums";

export type LikeCommentDB = {
    userId: string;
    commentId: string;
    createdAt: Date;
    likeStatus: LikeStatusEnum;
};

