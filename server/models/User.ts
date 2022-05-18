import { model, Document, Model, Schema } from 'mongoose';
import { NoteSchema, INote } from './note'

export interface IUser extends Document {
    username: string,
    password: string,
    credits: number,
    notes: INote[],
}

export const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    credits: {
        type: Number,
        required: true,
        min: 0,
    },
    notes: {
        type: [NoteSchema],
        select: false,
    },
})

export const User: Model<IUser> = model('User', UserSchema);