import { lastfm } from "./auth.config.js";
export const getArtistInfo = (artist_name) => {
    return new Promise((resolve, reject) => {
        lastfm.artist.getInfo({ artist: artist_name }, (err, artist) => {
            if (err) {
                reject(err);
            } else {
                resolve(artist);
            }
        });
    });
};

export const getAlbumInfo = (artist_name, album_name) => {
    return new Promise((resolve, reject) => {
        lastfm.album.getInfo({ artist: artist_name, album: album_name }, (err, album) => {
            if (err) {
                reject(err);
            } else {
                resolve(album);
            }
        });
    });
};

export const getMusicInfo = (artist_name, music_name) => {
    return new Promise((resolve, reject) => {
        lastfm.track.getInfo({ artist: artist_name, track: music_name }, (err, music) => {
            if (err) {
                reject(err);
            } else {
                resolve(music);
            }
        });
    });
};