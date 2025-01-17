import {
    getArtistInfo,
    getAlbumInfo,
    getMusicInfo,
    getMusicSearch,
    getAlbumSearch
} from "../lastfm.js"
import { prisma } from "../db.config.js";
import lrclib from "lrclib-api";
import { billboard } from "../billboard.js"
import {
    getAlbumItunes,
    getAlbumItunesEntity
} from "../itunes.js"
//당신을 위한 앨범 추천(연도)
export const getUserHistory = async (user_id) => {
    const userHistory = prisma.timeHistory.findMany({
        where: { userId: user_id },
        orderBy: { createdAt: "desc" }
    });
    return userHistory;
}
export const getUserArtistPrefers = async (user_id) => {
    const userArtist = prisma.userArtist.findMany({
        select: { artist: true },
        where: { userId: user_id },
        orderBy: { createdAt: "asc" },
        take: 5,
    });
    return userArtist;
}
//숨겨진 명곡
export const getBillboardAPI = async (date) => {
    const result = await billboard("hot-100", date, "1-10");
    return result.content;
    //return result.content
}
export const extractBillboard = async (billboard) => {
    const values = Object.values(billboard).slice(0, 10);
    const titles = values.map(item => item.title.replace(/\(.*$/i, "").trim());
    const artists = values.map(item => item.artist.replace(/( featuring| &| and).*$/i, "").trim());
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

//itunes에서 앨범 검색
export const searchAlbumAPI = async (music_name, artist_name) => {
    return getAlbumItunes(music_name, artist_name)
};

export const getLyricsAPI = async (artist_name, music_name) => {
    const lyrics = await lrclib.searchLyrics({
        'artist_name': artist_name,
        'track_name': music_name
    });
    if (!lyrics[0])
        return null
    return lyrics[0].syncedLyrics ? lyrics[0].syncedLyrics : lyrics[0].plainLyrics; //지금은 시간 있는 값으로 불러 와서 바꾸고 싶으면 여기 수정하면 됨
}
export const getMusicAPI = async (album, lyrics, artist_name, music_name) => {
    const musicInfo = await getMusicInfo(artist_name, music_name);
    if (!album)
        return null
    const data = {
        albumId: album.id,
        title: musicInfo ? musicInfo.name : music_name,
        lyrics: lyrics,
        releaseTime: album.releaseTime,
        image: album.image,
    };
    return data;
};

export const addMusic = async (data) => {
    if (!data)
        return null
    const created = await prisma.music.create({ data: data });
    return created;
}

export const addMusicArtist = async (artist, music) => {
    if (!(artist || music))
        return null
    const data = {
        artistId: artist.id,
        musicId: music.id
    }
    const musicArtist = await prisma.musicArtist.create({ data: data });
    return musicArtist;
}
export const addMusicGenre = async (genre, music) => {
    if (!(genre || music))
        return null
    const data = {
        genreId: genre.id,
        musicId: music.id
    }
    const musicArtist = await prisma.musicGenre.create({ data: data });
    return musicArtist;
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
    const albumItunes = await getAlbumItunesEntity(album_name, artist_name, "album")
    if (!(albumInfo && albumItunes))
        return null
    const data = {
        title: albumInfo.name ? albumInfo.name : albumItunes.collectionName,
        description: albumInfo.wiki ? albumInfo.wiki.summary : "none",
        releaseTime: new Date(albumInfo.wiki ? albumInfo.wiki.published : albumItunes.releaseDate),
        image: albumInfo.image[4]['#text'] ? albumInfo.image[4]['#text'] : albumItunes.artworkUrl100
    };
    return data;
};
export const getAlbumItunesAPI = async (artist_name, music_name) => {
    const albumInfo = await getAlbumItunes(music_name, artist_name)
    //data에서 albumInfo.wiki가 없는 경우가 있음
    if (!albumInfo)
        return null

    const data = {
        title: albumInfo.collectionName,
        description: "none",
        releaseTime: albumInfo.releaseDate,
        image: albumInfo.artworkUrl100
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