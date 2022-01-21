import * as mongoose from 'mongoose';
import { v4 } from 'uuid';

export const PostSchema = new mongoose.Schema(
  {
    _id: { type: String, default: v4 },
    posterUrl: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: Array, required: true },
    lastModifiedDate: { type: Date, required: true },
    like: { type: Number, default: 0, require: true },
    pv: { type: String, default: 0, required: true },
    isPublic: { type: Boolean, default: true, required: true },
  },
  {
    collection: 'post',
    timestamps: true,
  },
);

export interface PostDocument extends mongoose.Document {
  readonly _id: string
  readonly posterUrl: string
  readonly title: string
  readonly summary: string
  readonly content: string
  readonly tags: string[]
  readonly lastModifiedDate: Date
  readonly like: number
  readonly pv: number
  readonly isPublic: boolean
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly prev: PostDocument | null
  readonly next: PostDocument | null
}
