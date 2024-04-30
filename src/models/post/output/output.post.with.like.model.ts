import { LikeStatusEnum } from "../../common/enums";
import { OutputPostType } from "./outputPostModel";

export type OutputPostWithLikeType = OutputPostType & {
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatusEnum;
        newestLikes: NewestLikes[];
    }
} 

export type NewestLikes = {
    addedAt: string;
    userId: string;
    login: string;
}