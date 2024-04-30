import { LikeStatusEnum } from "../enums";

export type LikePostDB = {
    userId: string;
    postId: string;
    createdAt: Date;
    likeStatus: LikeStatusEnum;
};


