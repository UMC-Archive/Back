import { getArtistInfo, getAlbumInfo, getMusicInfo, getMusicSearch } from "../lastfm.js"
import { prisma } from "../db.config.js";
import { spotifyApi } from "../auth.config.js";
import { findLyrics } from "lrclib-api";
import { billboard } from "../billboard.js"
//숨겨진 명곡
export const getBillboardAPI = async (date) => {
    const result = await billboard("hot-100", date, "1-10");
    return JSON.parse(result).content;
    //return result.content
}
export const extractBillboard = async (billboard) => {
    const values = Object.values(billboard).slice(0, 10);
    const titles = values.map(item => item.title.replace(/\(.*$/i, "").trim());
    const artists = values.map(item => item.artist.replace(/( featuring| &).*$/i, "").trim());
    return {
        titles,
        artists
    }
}

//음악 정보 가져오기
//prisma에서 정보 가져오기
export const getMusicDB = async (music_name) => {
    const music = await prisma.music.findFirst({ where: { title: music_name } })
    return music;
};
//spotify에서 앨범 검색
export const searchAlbumAPI = async (music_name, artist_name) => {
    let data = await spotifyApi.searchTracks(`remaster artist:${artist_name} track:${music_name}`);
    if (!data.body.tracks.items[0]) {
        data = await spotifyApi.searchTracks(`track:${music_name}`);
    }
    return data.body.tracks.items[0].album.name;
};
export const getLyricsAPI = async (artist_name, music_name) => {
    const lyrics = await findLyrics({
        'artist_name': artist_name,
        'track_name': music_name
    });
    return lyrics.syncedLyrics; //지금은 시간 있는 값으로 불러 와서 바꾸고 싶으면 여기 수정하면 됨
}
export const getMusicAPI = async (album, lyrics, artist_name, music_name) => {
    const musicInfo = await getMusicInfo(artist_name, music_name);
    const data = {
        albumId: album.id,
        title: musicInfo.name,
        lyrics: lyrics,
        releaseTime: album.releaseTime,
        image: album.image,
    };
    return data;
};

export const addMusic = async (data) => {
    const created = await prisma.music.create({ data: data });
    return created;
}

//앨범 정보 가져오기
//prisma에서 정보 가져오기
export const getAlbumDB = async (album_name) => {
    const album = await prisma.album.findFirst({ where: { title: album_name } })
    return album;
}

//lastfm에서 정보 가저오기
export const getAlbumAPI = async (artist_name, album_name) => {
    const albumInfo = await getAlbumInfo(artist_name, album_name);
    //data에서 albumInfo.wiki가 없는 경우가 있음
    const data = {
        title: albumInfo.name,
        description: albumInfo.wiki ? albumInfo.wiki.summary : "none",
        releaseTime: albumInfo.wiki ? new Date(albumInfo.wiki.published) : new Date("1970-01-01"),
        image: albumInfo.image[4]['#text'] ? albumInfo.image[4]['#text'] : "no_image.jpg"
    };
    return data;
};

//prisma에 정보 추가하기
export const addAlbum = async (data) => {
    const created = await prisma.album.create({ data: data });
    return created;
};

//아티스트 정보 가져오기
//prisma에서 정보 가져오기
export const getArtistDB = async (artist_name) => {
    const artist = await prisma.artist.findFirst({ where: { name: artist_name } })
    return artist;
}

//lastfm에서 정보 가저오기
export const getArtistAPI = async (artist_name) => {
    const artistInfo = await getArtistInfo(artist_name);
    const data = {
        name: artistInfo.name,
        image: artistInfo.image[4]['#text'],
    };
    return data;
};

//prisma에 정보 추가하기
export const addArtist = async (data) => {
    const created = await prisma.artist.create({ data: data });
    return created;
};