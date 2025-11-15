import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
    users: String[];
    latestMessage: {
        text: string;
        sender: string;
    },
    createdAt: Date;
    updatedAt: Date;
}

// const schema:Schema<IChat> = new Schema({
//     users: [{type: Schema.Types.ObjectId, ref: 'User'}],
//     latestMessage:{
//         text:String,
//         sender: {type: Schema.Types.ObjectId, ref: 'User'}
//     },
//     createdAt: {type: Date, default: Date.now},
//     updatedAt: {type: Date, default: Date.now}
// })

const schema: Schema<IChat> = new Schema({
    users: [{ type: String, required: true }],
    latestMessage: {
        text: String,
        sender: String
    }
},
    { timestamps: true });

export const Chat = mongoose.model<IChat>("Chat", schema);