import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  userId: string;
  topic: string;
  titles: string[];
  description: string;
  tags: string[];
  thumbnailIdeas: string[];
  scriptOutline: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
    },
    titles: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    thumbnailIdeas: {
      type: [String],
      required: true,
    },
    scriptOutline: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model<IContent>('Content', ContentSchema);
