import { getArtistInfo, getAlbumInfo, getMusicInfo } from "../lastfm.js"
import { prisma } from "../db.config.js";
import { spotifyApi } from "../auth.config.js";
import { findLyrics } from "lrclib-api";
//아티스트 정보 가져오기
export const getArtist = async (artist_name) => {
    // db에 저장 되어 있다면 반환
    try {
        const artist = await prisma.artist.findFirst({ where: { name: artist_name } })
        if (artist) {
            return artist;
        }
        // lastfm에서 artist 검색 후 db에 저장 및 반환

        const artistInfo = await getArtistInfo(artist_name);
        const data = {
            name: artistInfo.name,
            image: artistInfo.image[4]['#text'],
        };
        const created = await prisma.artist.create({ data: data });
        return created;
    } catch (err) {
        throw new Error('Error fetching artist info from LastFM: ' + err.message);
    }
};

//앨범 정보 가져오기
export const getAlbum = async (artist_name, album_name) => {
    // db에 저장 되어 있다면 반환
    const album = await prisma.album.findFirst({ where: { title: album_name } })
    if (album) {
        return album;
    }
    // lastfm에서 album 검색 후 db에 저장 및 반환
    try {
        const albumInfo = await getAlbumInfo(artist_name, album_name);
        console.log(albumInfo)
        //data에서 albumInfo.wiki가 없는 경우가 있음
        const data = {
            title: albumInfo.name,
            description: albumInfo.wiki ? albumInfo.wiki.summary : "none",
            releseTime: albumInfo.wiki ? new Date(albumInfo.wiki.published) : new Date("1970-01-01"),
            image: albumInfo.image[4]['#text']
        };
        const created = await prisma.album.create({ data: data });
        return created;
    } catch (err) {
        throw new Error('Error fetching album info from LastFM: ' + err.message);
    }
};

//음악 정보 가져오기
export const getMusic = async (artist_name, music_name) => {
    // db에 저장 되어 있다면 반환
    try {
        const music = await prisma.music.findFirst({ where: { title: music_name } })
        if (music) {
            return music;
        }
        // lastfm에서 track 검색 후 db에 저장 및 반환
        const album_name = await spotifyApi.searchTracks(`track:${music_name} artist:${artist_name}`)
            .then(function (data) {
                return data.body.tracks.items[0].album.name
            }, function (err) {
                console.error(err);
            });
        console.log(artist_name, music_name, album_name)
        let album = await prisma.album.findFirst({ where: { title: album_name } })
        if (!album) {
            album = await getAlbum(artist_name, album_name)
        }
        const musicInfo = await getMusicInfo(artist_name, music_name);
        //가사 가져오기
        const lyrics = await findLyrics({
            'artist_name': artist_name,
            'track_name': music_name
        });
        const created_data = {
            albumId: album.id,
            title: musicInfo.name,
            lyrics: lyrics.syncedLyrics,
            releseTime: album.releseTime,
            image: album.image
        };
        const created = await prisma.music.create({ data: created_data });
        return created;
    } catch (err) {
        throw new Error('Error fetching music info from LastFM: ' + err.message);
    }
};