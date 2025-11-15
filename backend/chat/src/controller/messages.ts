import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    chatId: string;
    sender: string;
    text?: string;
    image?: {
        url: string;
        publicId: string;
    }
    messageType: 'text' | 'image';
    seen: Boolean;
    seenAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const schema= new Schema<IMessage>({
    chatId: {
        type: String,
        required: true,
        ref:"Chat"
    },
    sender:{
        type: String,
        required: true
    },
    text: String,
    image: {
        url: String,
        publicId: String
    },
    messageType: {
        type: String,
        enum: ['text', 'image'],
        default: 'text'
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: Date
},
{timestamps: true}
)

export const Message = mongoose.model<IMessage>('Message', schema);

