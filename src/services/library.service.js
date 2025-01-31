import { status } from "../../config/response.status.js";
import {
  getLibraryMusics,
  getLibraryArtists,
  getLibraryAlbums,
} from "../repositories/library.repository.js";
import {
  responseFromAllMusics,
  responseFromAllArtists,
  responseFromAllAlbums,
} from "../dtos/library.dto.js";
import { response } from "../../config/response.js";

export const listLibraryMusics = async (userId) => {
  try {
    if (!userId) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const musics = await getLibraryMusics(userId);

    return response(status.SUCCESS, responseFromAllMusics(musics));
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};

export const listLibraryArtists = async (userId) => {
  try {
    console.log("userId : " + userId);
    if (!userId) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const artists = await getLibraryArtists(userId);
    console.log("service artists : " + JSON.stringify(artists, null, 2));

    return response(status.SUCCESS, responseFromAllArtists(artists));
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};

export const listLibraryAlbums = async (userId) => {
  try {
    if (!userId) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const albums = await getLibraryAlbums(userId);
    console.log("service albums : " + JSON.stringify(albums, null, 2));

    return response(status.SUCCESS, responseFromAllAlbums(albums));
  } catch (err) {
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};
