import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: String,
    email: String
}

const schema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true});

export const User = mongoose.model<IUser>("User", schema);