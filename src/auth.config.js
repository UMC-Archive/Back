import LastfmAPI from "lastfmapi";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config();
export const lastfm = new LastfmAPI({
    api_key: process.env.LASTFM_API,
    secret: process.env.LASTFM_SECRET
})

export const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRET_URI
})