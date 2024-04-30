import { LikeStatusEnum } from "../../enums";

export type LikeCommentOutputType = {
    id: string;
    userId: string;
    commentId: string;
    createdAt: string;
    likeStatus: LikeStatusEnum;
};
