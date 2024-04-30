import { LikeStatusEnum } from "../../common/enums";
import { OutputCommentType } from "./output.comment.model";

export type OutputCommentWithLikeType = OutputCommentType & {
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatusEnum
    }
} 