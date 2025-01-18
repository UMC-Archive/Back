import LastfmAPI from "lastfmapi";
import dotenv from "dotenv";
dotenv.config();
export const lastfm = new LastfmAPI({
    api_key: process.env.LASTFM_API,
    secret: process.env.LASTFM_SECRET
})