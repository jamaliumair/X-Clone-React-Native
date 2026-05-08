import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT : process.env.PORT || 3000,
    MONGO_URI : process.env.MONGO_URI,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
    ARCJET_KEY : process.env.ARCJET_API_KEY
};