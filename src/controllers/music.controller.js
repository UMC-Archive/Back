import { StatusCodes } from "http-status-codes";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { } from "../dtos/music.dto.js";
import {
  listMusic,
  listArtist,
  listAlbum,
  listHiddenMusics,
  listNominationAlbum,
  listNominationMusic,
  listGenre,
  listSpecificArtistInfo,
  listAllArtistInfo,
} from "../services/music.service.js";
//추천곡 (연도)
export const handleMusicNomination = async (req, res, next) => {
  /*
   #swagger.summary = '추천곡 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "추천곡 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
              isSuccess: { type: "boolean", example: true },
              code: { type: "number", example: 200 },
              message: { type: "string", example: "success!" },
              result: {
                type: "object",
                properties: {
                  musics: {
                    type: "array", items: { 
                      type: "object",  properties: {
                      id: { type: "number", example: 1 },
                      albumId: { type: "number", example: 1 },
                      title: { type: "string", example: "Celebrity" },
                      releseTime : { type: "string", format: "date", example: "2021-03-25" },
                      lyics: { type: "string", example: "세상의 모서리 구부정하게  커버린 골칫거리 outsider (ah ah)" },
                      image: { type: "string", example: "https://example.com/music_image.jpg" },
                      createdAt : { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt : { type: "string", format: "date", example: "2025-01-01" }
                    }
                  }
                } 
              }
             } 
           }
         }
       }
     }
   };
   #swagger.responses[400] = {
      description: "추천곡 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MUSIC4001" },
              message: { type: "string", example: "음악이 존재하지 않습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try {
    console.log("당신을 위한 노래 추천을 요청했습니다!");
    const music = await listNominationMusic(req.query.user_id);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null))
  }
};
//당신을 위한 앨범 추천(연도)
export const handleAlbumNomination = async (req, res, next) => {
  /*
   #swagger.summary = '당신을 위한 앨범 추천 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "당신을 위한 앨범 추천 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
              isSuccess: { type: "boolean", example: true },
              code: { type: "number", example: 200 },
              message: { type: "string", example: "success!" },
              result: {
                type: "object",
                properties: {
                  albums: {
                    type: "array", items: { 
                      type: "object",  properties: {
                        id: { type: "number", example: 1 },
                        title: { type: "string", example: "IU 5th Album 'LILAC'" },
                        description: { type: "string", example: "안녕 꽃잎 같은 안녕 내 맘에 아무 의문이 없어 난 이 다음으로 가요" },
                        releseTime : { type: "string", format: "date", example: "2021-03-25" },
                        image: { type: "string", example: "https://example.com/album_image.jpg" },
                        createdAt : { type: "string", format: "date", example: "2025-01-01" },
                        updatedAt : { type: "string", format: "date", example: "2025-01-01" }
                      }
                    }
                  }
                }
              } 
           }
         }
       }
     }
   };
   #swagger.responses[400] = {
     description: "앨범 정보를 찾을 수 없음",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MUSIC4002" },
              message: { type: "string", example: "앨범이 존재하지 않습니다." },
              result: { type: "object", nullable: true, example: null }
           }
         }
       }
     }
   };
 */
  try {
    console.log("당신을 위한 앨범 추천을 요청했습니다!");
    const album = await listNominationAlbum(req.query.user_id);
    res.send(response(status.SUCCESS, album));
  } catch (err) {
    res.send(response(status.ALBUM_NOT_EXIST, null))
  }
};
//숨겨진 명곡
export const handleMusicHidden = async (req, res, next) => {
  /*
   #swagger.summary = '숨겨진 명곡 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "숨겨진 명곡 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: {
                  type: "object",
                  properties: {
                    musics: {
                      type: "array", items: { 
                        type: "object",  properties: {
                        id: { type: "number", example: 1 },
                        albumId: { type: "number", example: 1 },
                        title: { type: "string", example: "Celebrity" },
                        releseTime : { type: "string", format: "date", example: "2021-03-25" },
                        lyics: { type: "string", example: "세상의 모서리 구부정하게  커버린 골칫거리 outsider (ah ah)" },
                        image: { type: "string", example: "https://example.com/music_image.jpg" },
                        createdAt : { type: "string", format: "date", example: "2025-01-01" },
                        updatedAt : { type: "string", format: "date", example: "2025-01-01" }
                        }
                      }
                    }
                  } 
              }
           }
         }
       }
     }
   };
   #swagger.responses[400] = {
     description: "숨겨진 명곡 정보를 찾을 수 없음",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MUSIC4001" },
              message: { type: "string", example: "음악이 존재하지 않습니다." },
              result: { type: "object", nullable: true, example: null }
           }
         }
       }
     }
   };
 */
  try {
    console.log("숨겨진 명곡 조회를 요청했습니다!");
    const music = await listHiddenMusics(req.query.date);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null))
  }
};
//노래 정보 가져오기
export const handleMusicInfo = async (req, res, next) => {
  /*
   #swagger.summary = '노래 정보 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "노래 정보 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
              isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: {
                  type: "object",
                  properties: {
                    id: { type: "number", example: 1 },
                    albumId: { type: "number", example: 1 },
                    title: { type: "string", example: "Celebrity" },
                    releseTime : { type: "string", format: "date", example: "2021-03-25" },
                    lyics: { type: "string", example: "세상의 모서리 구부정하게  커버린 골칫거리 outsider (ah ah)" },
                    image: { type: "string", example: "https://example.com/music_image.jpg" },
                    createdAt : { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt : { type: "string", format: "date", example: "2025-01-01" }
                    }
                }
           }
         }
       }
     }
   };
   #swagger.responses[400] = {
     description: "노래 정보 조회 실패 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
                isSuccess: { type: "boolean", example: false },
                code: { type: "string", example: "MUSIC4001" },
                message: { type: "string", example: "음악이 존재하지 않습니다." },
                result: { type: "object", nullable: true, example: null }
          }
         }
       }
     }
   };
 */
  try {
    console.log("노래 정보 가져오기를 요청했습니다!");
    const music = await listMusic(req.query.artist_name, req.query.music_name);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null))
  }
};
//앨범 정보 가져오기
export const handleMusicAlbumInfo = async (req, res, next) => {
  /*
   #swagger.summary = '앨범 정보 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "앨범 정보 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
              isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: {
                  type: "object",
                  properties: {
                    id: { type: "number", example: 1 },
                    title: { type: "string", example: "IU 5th Album 'LILAC'" },
                    description: { type: "string", example: "안녕 꽃잎 같은 안녕 내 맘에 아무 의문이 없어 난 이 다음으로 가요" },
                    releseTime : { type: "string", format: "date", example: "2021-03-25" },
                    image: { type: "string", example: "https://example.com/album_image.jpg" },
                    createdAt : { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt : { type: "string", format: "date", example: "2025-01-01" }
                    }
                }
           }
         }
       }
     }
   };
   #swagger.responses[400] = {
     description: "앨범 정보 조회 실패 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MUSIC4002" },
              message: { type: "string", example: "앨범이 존재하지 않습니다." },
              result: { type: "object", nullable: true, example: null }
           }
         }
       }
     }
   };
 */
  try {
    console.log("앨범 정보 가져오기를 요청했습니다!");
    const album = await listAlbum(req.query.artist_name, req.query.album_name);
    res.send(response(status.SUCCESS, album));
  } catch (err) {
    res.send(response(status.ALBUM_NOT_EXIST, null))
  }
};
//아티스트 정보 가져오기
export const handleMusicArtistInfo = async (req, res, next) => {
  /*
    #swagger.summary = '아티스트 정보 조회 API';
    #swagger.tags = ['Music']
    #swagger.responses[200] = {
      description: "아티스트 정보 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: {
                  type: "object",
                  properties: {
                    id: { type: "number", example: 1 },
                    name: { type: "string", example: "IU" },
                    image: { type: "string", example: "https://example.com/artist_image.jpg" },
                    createdAt : { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt : { type: "string", format: "date", example: "2025-01-01" }
                }
              }
            }
          }
        }
      }
    };
   #swagger.responses[400] = {
     description: "아티스트 정보 조회 실패 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MUSIC4003" },
              message: { type: "string", example: "아티스트가 존재하지 않습니다." },
              result: { type: "object", nullable: true, example: null }
           }
         }
       }
     }
   };
 */
  try {
    console.log("아티스트 정보 가져오기를 요청했습니다!");
    const artist = await listArtist(req.query.artist_name);
    res.send(response(status.SUCCESS, artist));
  } catch (err) {
    res.send(response(status.ARTIST_NOT_EXIST, null))
  }
};

export const handleMusicGenreInfo = async (req, res, next) => {
  try {
    console.log("장르 정보 가져오기를 요청했습니다!");
    const response = await listGenre();
    const statusCode = response.isSuccess ? 200 : "COMMON001" ? 400 : 500;
    return res.status(statusCode).json(response);
  } catch (err) {
    return next(err);
  }
};

export const handleArtistsInfo = async (req, res, next) => {
  try {
    console.log("아티스트 정보 가져오기를 요청했습니다!");
    const user_id = req.query.user_id;
    const artist = req.query.artist_name;

    if (!artist) {
      const result = await listAllArtistInfo(user_id);
      const statusCode = result.isSuccess ? 200 : "SIGNIN4002" ? 400 : 500;
      return res.status(statusCode).json(result);
    } else {
      const result = await listSpecificArtistInfo(user_id, artist);
      const statusCode = result.isSuccess ? 200 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (err) {
    return next(err);
  }
};
