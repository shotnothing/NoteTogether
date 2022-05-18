import { model, Document, Model, ObjectId, Schema } from 'mongoose';
import { TagSchema, ITag } from './Tag';
import { ChangeSchema, IChange } from './change'

export interface INote extends Document {
    title: string,
    user: string,
    created: Date,
    lastUpdated: Date,
    published: boolean,
    content: string[],
    forkedFrom?: ObjectId,
    changes?: IChange[],
    tags?: ITag[],
    upvotes: number,
    downvotes: number,
    views: number,
    cheatsheets: number,
    forks: number,
};

export const NoteSchema: Schema = new Schema({
    title: { 
        type: String,
        required: true,
        index: { unique: false },
    },
    user: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    },
    content: {
        type: [String],
        required: true,
    },
    forkedFrom: {
        type: Schema.Types.ObjectId,
        ref: 'Note',
    },
    changes: {
        type: [ChangeSchema],
    },
    tags: {
        type: [TagSchema],
    },
    upvotes: {
        type: Number,
        required: true,
        min: 0,
    },
    downvotes: {
        type: Number,
        required: true,
        min: 0,
    },
    views: {
        type: Number,
        required: true,
        min: 0,
    },
    cheatsheets: {
        type: Number,
        required: true,
        min: 0,
    },
    forks: {
        type: Number,
        required: true,
        min: 0,
    },
});

export const Note: Model<INote> = model('Note', NoteSchema);