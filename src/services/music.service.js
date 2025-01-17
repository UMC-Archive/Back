import {
    responseFromArtist,
    responseFromAlbum,
    responseFromMusic,
    responseFromHiddenMusics
} from "../dtos/music.dto.js";
import {
    getBillboardAPI,
    extractBillboard,
    getMusicDB,
    getMusicAPI,
    addMusic,
    getLyricsAPI,
    getAlbumDB,
    getAlbumAPI,
    addAlbum,
    searchAlbumAPI,
    getArtistDB,
    getArtistAPI,
    addArtist,
} from "../repositories/music.repository.js";
//숨겨진 명곡
export const listHiddenMusics = async (date) => {
    const billboardTop10 = await getBillboardAPI(date)
    const { titles, artists } = await extractBillboard(billboardTop10)
    const musics = await Promise.all(
        artists.map((artist, i) => listMusic(artist, titles[i]))
    );
    return responseFromHiddenMusics(
        {
            musics
        });
}
//음악 정보 가져오기
export const listMusic = async (artist_name, music_name) => {
    //DB에 음악이 저장 되어 있을 때
    const musicDB = await getMusicDB(music_name)
    if (musicDB) {
        return responseFromMusic(musicDB);
    }

    //DB에 음악이 저장 되어 있지 않을 때
    //앨범 정보
    const albumName = await searchAlbumAPI(music_name, artist_name); // spotify api 사용
    let album = {}
    album = await getAlbumDB(albumName);
    if (!album) {
        const apiInfo = await getAlbumAPI(artist_name, albumName)
        album = await addAlbum(apiInfo);
    }
    //음악 가사 정보
    let lyrics = await getLyricsAPI(artist_name, music_name);
    //가사를 불러 올 수 없을 때가 존재함, 추후에 다른 api를 찾으면 none 대신 다른 api를 통해 찾기로 변경
    if (!lyrics) {
        lyrics = "none";
    }

    //음악 정보
    const apiInfo = await getMusicAPI(album, lyrics, artist_name, music_name);
    console.log(apiInfo)
    const music = await addMusic(apiInfo);

    return responseFromMusic(music);
}

//앨범 정보 가져오기
//앨범 정보가 없어 가져오지 못 할 때가 있음
export const listAlbum = async (artist_name, album_name) => {
    //DB에 앨범이 저장 되어 있을 때
    const albumDB = await getAlbumDB(album_name);
    if (albumDB) {
        return responseFromAlbum(albumDB);
    }

    //DB에 앨범이 저장 되어 있지 않을 때
    const apiInfo = await getAlbumAPI(artist_name, album_name);
    const album = await addAlbum(apiInfo);

    return responseFromAlbum(album);
}

//아티스트 정보 가져오기
export const listArtist = async (artist_name) => {
    //DB에 아티스트가 저장 되어 있을 때
    const artistDB = await getArtistDB(artist_name)
    if (artistDB) {
        return responseFromArtist(artistDB)
    }

    //DB에 아티스트가 저장 되어 있지 않을 때
    const apiInfo = await getArtistAPI(artist_name);
    const artist = await addArtist(apiInfo);

    return responseFromArtist(artist);
}