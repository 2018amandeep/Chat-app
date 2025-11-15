import mongoose from 'mongoose'

const connectDb = async () => {
    const uri = process.env.MONGO_URI;

    if(!uri) {
        throw new Error('MongoDB URI not found in env variable')
    }
    try {
        await mongoose.connect(uri!, {
            dbName:"ChapAppMicroservice"
        })
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDb;   