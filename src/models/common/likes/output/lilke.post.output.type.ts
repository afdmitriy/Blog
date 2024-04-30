import { LikeStatusEnum } from "../../enums";

export type LikePostOutputType = {
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
    likeStatus: LikeStatusEnum;
};
