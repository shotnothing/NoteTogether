import { model, Schema, Model, Document } from 'mongoose';

export interface ITag extends Document {
    name: string,
    numOfNotes: number,
};

export const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    numOfNotes: {
        type: Number,
        required: true,
    },
});

const Tag: Model<ITag> = model('Tag', TagSchema);