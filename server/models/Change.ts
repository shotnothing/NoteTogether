import { model, Document, Model, Schema } from 'mongoose';

export interface IChange extends Document {
    lineNumber: number,
    toInsert: boolean,
    content?: string,
};

export const ChangeSchema: Schema = new Schema({
    lineNumber: {
        type: Number,
        required: true,
    },
    toInsert: {
        type: Boolean,
        required: true,
    },
    content: {
        type: String,
    },
});

export const Change: Model<IChange> = model('Change', ChangeSchema);