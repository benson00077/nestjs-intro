import * as mongoose from 'mongoose';
import { v4 } from 'uuid';

export const PostStatisticsSchema = new mongoose.Schema(
  {
    id: { type: String, default: v4 },
    postId: { type: String, required: true },
    postName: { type: String, required: true },
    scenes: { type: String, required: true },
  },
  {
    collection: 'post_statistics',
    timestamps: true,
  },
);

export interface PostStatisticsDocument extends mongoose.Document {
  readonly _id: string
  readonly postId: string
  readonly postName: string
  readonly scenes: string
  readonly createdAt: Date
  readonly updatedAt: Date
}
