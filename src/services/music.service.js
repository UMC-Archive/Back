import {
    responseFromArtist,
    responseFromAlbum,
    responseFromMusic
} from "../dtos/music.dto.js";
import {
    getArtist,
    getAlbum,
    getMusic
} from "../repositories/music.repository.js";

//음악 정보 가져오기
export const listMusic = async (artist_name, music_name) => {
    const artist = await getArtist(artist_name);
    const music = await getMusic(artist_name, music_name)
    return responseFromMusic(
        {
            music
        });
}

//앨범 정보 가져오기
export const listAlbum = async (artist_name, album_name) => {
    const artist = await getArtist(artist_name);
    const album = await getAlbum(artist_name, album_name);
    return responseFromAlbum(
        {
            album
        });
}

//아티스트 정보 가져오기
export const listArtist = async (artist_name) => {
    const artist = await getArtist(artist_name)
    return responseFromArtist(
        {
            artist
        });
}