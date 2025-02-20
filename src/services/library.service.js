import { status } from "../../config/response.status.js";
import {
  getLibraryMusics,
  getLibraryArtists,
  getLibraryAlbums,
  addMusicLibraryRepo,
  addAlbumLibraryRepo,
  addArtistLibraryRepo,
  deleteMusicLibraryRepo,
  deleteAlbumLibraryRepo,
  deleteArtistLibraryRepo
} from "../repositories/library.repository.js";
import {
  responseFromAllMusics,
  responseFromAllArtists,
  responseFromAllAlbums,
} from "../dtos/library.dto.js";
import { response } from "../../config/response.js";

//보관함 음악 삭제
export const deleteMusicLibraryService = async (user_id, music_id) => {
  try {
    if (!music_id) {
      return response(status.MUSIC_NOT_EXIST, null);
    }
    const result = await deleteMusicLibraryRepo(user_id, music_id);
    return result
  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 앨범 삭제
export const deleteAlbumLibraryService = async (user_id, album_id) => {
  try {
    if (!album_id) {
      return response(status.ALBUM_NOT_EXIST, null);
    }
    const result = await deleteAlbumLibraryRepo(user_id, album_id);
    return result
  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 아티스트 삭제
export const deleteArtistLibraryService = async (user_id, artist_id) => {
  try {
    if (!artist_id) {
      return response(status.ARTIST_NOT_EXIST, null);
    }
    const result = await deleteArtistLibraryRepo(user_id, artist_id);
    return result
  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 음악 추가
export const addMusicLibraryService = async (user_id, music_id) => {
  try {
    if (!music_id) {
      return response(status.MUSIC_NOT_EXIST, null);
    }
    const result = await addMusicLibraryRepo(user_id, music_id);
    return result

  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 앨범 추가
export const addAlbumLibraryService = async (user_id, album_id) => {
  try {
    if (!album_id) {
      return response(status.ALBUM_NOT_EXIST, null);
    }
    const result = await addAlbumLibraryRepo(user_id, album_id);
    //console.log(result);
    return result;

  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 아티스트 추가
export const addArtistLibraryService = async (user_id, artist_id) => {
  try {
    if (!artist_id) {
      return response(status.ARTIST_NOT_EXIST, null);
    }
    const result = await addArtistLibraryRepo(user_id, artist_id);
    //console.log(result);
    return result;

  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

export const listLibraryMusics = async (user_id) => {
  try {
    if (!user_id) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const musics = await getLibraryMusics(user_id);

    return response(status.SUCCESS, responseFromAllMusics(musics));
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};

export const listLibraryArtists = async (user_id) => {
  try {
    //console.log("user_id : " + user_id);
    if (!user_id) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const artists = await getLibraryArtists(user_id);
    //console.log("service artists : " + JSON.stringify(artists, null, 2));

    return response(status.SUCCESS, responseFromAllArtists(artists));
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};

export const listLibraryAlbums = async (user_id) => {
  try {
    if (!user_id) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const albums = await getLibraryAlbums(user_id);
    //console.log("service albums : " + JSON.stringify(albums, null, 2));

    return response(status.SUCCESS, responseFromAllAlbums(albums));
  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};
