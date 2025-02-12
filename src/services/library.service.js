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
export const deleteMusicLibraryService = async(userId, musicId)=>{
  try{
    if(!musicId){
      return response(status.MUSIC_NOT_EXIST, null);
    }
    const result = await deleteMusicLibraryRepo(userId, musicId);
    return result
  }catch(err){
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 앨범 삭제
export const deleteAlbumLibraryService = async(userId, albumId)=>{
  try{
    if(!albumId){
      return response(status.ALBUM_NOT_EXIST, null);
    }
    const result = await deleteAlbumLibraryRepo(userId, albumId);
    return result
  }catch(err){
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 아티스트 삭제
export const deleteArtistLibraryService = async(userId, artistId)=>{
  try{
    if(!artistId){
      return response(status.ARTIST_NOT_EXIST, null);
    }
    const result = await deleteArtistLibraryRepo(userId, artistId);
    return result
  }catch(err){
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 음악 추가
export const addMusicLibraryService = async(userId, musicId)=>{
  try{
    if(!musicId){
      return response(status.MUSIC_NOT_EXIST, null);
    }
    const result = await addMusicLibraryRepo(userId, musicId);
    return result

  }catch(err){
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 앨범 추가
export const addAlbumLibraryService = async(userId, albumId)=>{
  try{
    if(!albumId){
      return response(status.ALBUM_NOT_EXIST, null);
    }
    const result = await addAlbumLibraryRepo(userId, albumId);
    console.log(result);
    return result;

  }catch(err){
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함 아티스트 추가
export const addArtistLibraryService = async(userId, artistId)=>{
  try{
    if(!artistId){
      return response(status.ARTIST_NOT_EXIST, null);
    }
    const result = await addArtistLibraryRepo(userId, artistId);
    console.log(result);
    return result;

  }catch(err){
    console.log(err);
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

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
