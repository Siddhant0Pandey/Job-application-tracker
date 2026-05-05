import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


interface MongooseCache{
conn:typeof mongoose | null;
promise:Promise<typeof mongoose> | null;
}

declare global{
    var mongooseCache:MongooseCache;
}

const cached:MongooseCache = global.mongooseCache || {conn:null, promise:null};

if(!global.mongooseCache){
    global.mongooseCache = cached;
}

async function dbConnect(){

    
if(!MONGODB_URI){
    throw new Error(
        "Please!, connect to the MongoDb"
    )
}

    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts = {
            bufferCommands:false,
        }

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose)=>{
            return mongoose;
        })
    }
try{
    cached.conn = await cached.promise;
    return cached.conn;
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
}
}

export default dbConnect;