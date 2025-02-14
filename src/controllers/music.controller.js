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
  listSpecificArtistInfo,
  listAllArtistInfo,
  listNomMusics,
  albumCuration,
  artistCuration,
  genreImage,
  listNomAlbums,
  listAlbumTrackList,
  listSimilarArtists,
  listDifferentAlbum,
  findMusic,
  findAlbum,
  findArtist,
  listSelectionMusic,
  listMainMusics,
  listTopMusicArtists,
  listTopAlbumArtists,

} from "../services/music.service.js";
import { BaseError } from "../errors.js";
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
          code: { type: "string", example: "200" },
          message: { type: "string", example: "success!" },
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                music: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    albumId: { type: "string", example: "1" },
                    title: { type: "string", example: "Love poem" },
                    releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                    lyrics: { type: "string", example: "가사" },
                    image: { type: "string", example: "https://image.png" },
                    music: { type: "string", example: "https://music.m4a" },
                    createdAt: { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                  }
                },
                album: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "Love poem" },
                    releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                    image: { type: "string", example: "https://image.png" },
                    createdAt: { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                  }
                },
                artist: { type: "string", example: "IU" }
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
    const music = await listNominationMusic(req.userId);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null));
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
          code: { type: "string", example: "200" },
          message: { type: "string", example: "success!" },
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                album: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "Love poem" },
                    releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                    image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/28db3fdca036fb53c62754694a89d3fd.jpg" },
                    createdAt: { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                  }
                },
                artist: { type: "string", example: "IU" }
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
    const album = await listNominationAlbum(req.userId);
    res.send(response(status.SUCCESS, album));
  } catch (err) {
    res.send(response(status.ALBUM_NOT_EXIST, null));
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
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
               type: "object", 
                properties: { 
                  music: {
                    type: "object",  
                    properties: {
                      id: { type: "string", example: "1" },
                      albumId: { type: "string", example: "1" },
                      title: { type: "string", example: "Love poem" },
                      releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                      lyrics: { type: "string", example: "가사" },
                      image: { type: "string", example: "https://example.com/music_image.jpg" },
                      music: { type: "string", example: "https://example.com/preview_music.m4a" },
                      createdAt: { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                   }
                 },
                 album: {
                    type: "object",  
                    properties: {
                      id: { type: "string", example: "1" },
                      title: { type: "string", example: "Love poem" },
                      releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                      image: { type: "string", example: "https://example.com/album_image.jpg" },
                      createdAt: { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                   }
                 },
                  artist: { type: "string", example: "IU" }
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
    const music = await listHiddenMusics(req.userId);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null));
  }
};
//메인 CD
export const handleMusicMain = async (req, res, next) => {
  /*
    #swagger.summary = '메인 CD 조회 API';
    #swagger.tags = ['Music']
    #swagger.responses[200] = {
    description: "메인 CD 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
               type: "object", 
                properties: { 
                  music: {
                    type: "object",  
                    properties: {
                      id: { type: "string", example: "1" },
                      albumId: { type: "string", example: "1" },
                      title: { type: "string", example: "Love poem" },
                      releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                      lyrics: { type: "string", example: "가사" },
                      image: { type: "string", example: "https://example.com/music_image.jpg" },
                      music: { type: "string", example: "https://example.com/preview_music.m4a" },
                      createdAt: { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                   }
                 },
                 album: {
                    type: "object",  
                    properties: {
                      id: { type: "string", example: "1" },
                      title: { type: "string", example: "Love poem" },
                      releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                      image: { type: "string", example: "https://example.com/album_image.jpg" },
                      createdAt: { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                   }
                 },
                  artist: { type: "string", example: "IU" }
                }
              }
            }
          }
       }
     }
    }
  };
  #swagger.responses[400] = {
  description: "메인 CD 정보를 찾을 수 없음",
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
    console.log("메인 CD 조회를 요청했습니다!");
    const music = await listMainMusics(req.userId);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null));
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
                    music: { type: "string", example: "https://example.com/preview_music.m4a"},
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
    res.send(response(status.MUSIC_NOT_EXIST, null));
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
                    releseTime : { type: "string", format: "date", example: "2021-03-25" },
                    image: { type: "string", example: "https://example.com/album_image.jpg" },
                    createdAt : { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt : { type: "string", format: "date", example: "2025-01-01" },
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
    console.log(req.userId);
    const album = await listAlbum(req.query.artist_name, req.query.album_name);
    res.send(response(status.SUCCESS, album));
  } catch (err) {
    res.send(response(status.ALBUM_NOT_EXIST, null));
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
    const artist = await listArtist(
      req.query.artist_name,
      req.query.album_name
    );
    res.send(response(status.SUCCESS, artist));
  } catch (err) {
    res.send(response(status.ARTIST_NOT_EXIST, null));
  }
};

export const handleMusicGenreInfo = async (req, res, next) => {
  /*
   #swagger.summary = '장르 정보 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "장르 정보 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "number", example: 200 },
             message: { type: "string", example: "success!" },
             result: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   id: { type: "string", example: "1" },
                   name: { type: "string", example: "Other" },
                   image: { type: "string", example: "images/01.png" }
                 }
               }
             }
           }
         }
       }
     }
   };
  #swagger.responses[400] = {
    description: "장르 정보 조회 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON001" },
            message: { type: "string", example: "잘못된 요청입니다." },
            result: { type: "null", example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 에러",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "null", example: null }
          }
        }
      }
    }
  };
*/
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
  /*
   #swagger.summary = '아티스트 정보 조회 API';
   #swagger.tags = ['Music']
   #swagger.parameters['artist_name'] = {
       in: 'query',
       description: '아티스트 이름',
       required: false,
       type: 'string'
   }
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
               oneOf: [
                 {
                   type: "object",
                   properties: {
                     artists: {
                       type: "array",
                       items: {
                         type: "object",
                         properties: {
                           id: {type: "string", example: "1"},
                           name: { type: "string", example: "Ariana Grande" },
                           image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" }
                         }
                       }
                     }
                   }
                 },
                 {
                   type: "object",
                   properties: {
                   id: {type: "string", example: "2"},
                     name: { type: "string", example: "SZA" },
                     image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" }
                   }
                 }
               ]
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
            code: { type: "string", example: "SIGNIN4002" },
            message: { type: "string", example: "아이디를 찾을 수 없습니다." },
            result: { type: "null", example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 에러",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "null", example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("아티스트 정보 가져오기를 요청했습니다!");
    const user_id = req.user_id;
    const artist = req.query.artist_name;

    if (!artist) {
      const result = await listAllArtistInfo(user_id);
      const statusCode = result.isSuccess ? 200 : "SIGNIN4002" ? 400 : 500;
      return res.status(statusCode).json(result);
    } else {
      const result = await listSpecificArtistInfo(artist);
      const statusCode = result.isSuccess ? 200 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (err) {
    return next(err);
  }
};

// 음악 콘텐츠 추천
export const handleCommonMusicNomination = async (req, res, next) => {
  /*
   #swagger.summary = '추천 콘텐츠(일반) 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "추천곡 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   music: {
                     type: "object",
                     properties: {
                       id: { type: "string", example: "5" },
                       albumId: { type: "string", example: "2" },
                       title: { type: "string", example: "Starboy" },
                       releaseTime: { type: "string", format: "date-time", example: "2022-12-12T03:33:00.000Z" },
                       lyrics: { type: "string", example: "[00:57.38] I'm tryna put you in the worst mood, ah..." },
                       image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/08e3f15aca0423b084fb49f342756f3b.png" },
                       music: { type: "string", example: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/f7/bf/0df7bf34-b7b7-4390-95ef-91749556c20d/mzaf_8636523417719572612.plus.aac.p.m4a" },
                       createdAt: { type: "string", format: "date-time", example: "2025-02-03T11:07:28.230Z" },
                       updatedAt: { type: "string", format: "date-time", example: "2025-02-03T11:07:28.230Z" }
                     }
                   },
                   album: {
                     type: "object",
                     properties: {
                       id: { type: "string", example: "2" },
                       title: { type: "string", example: "Starboy" },
                       releaseTime: { type: "string", format: "date-time", example: "2022-12-12T03:33:00.000Z" },
                       image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/08e3f15aca0423b084fb49f342756f3b.png" },
                       createdAt: { type: "string", format: "date-time", example: "2025-02-03T11:06:05.634Z" },
                       updatedAt: { type: "string", format: "date-time", example: "2025-02-03T11:06:05.634Z" }
                     }
                   },
                   artist: { type: "string", example: "The Weeknd" }
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
    const music = await listNomMusics(req.userId);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null));
  }
};

// 당신을 위한 앨범 추천(일반)
export const handleCommonAlbumNomination = async (req, res, next) => {
  /*
   #swagger.summary = '딩신을 위한 앨범 추천(일반) 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
     description: "앨범 목록 조회 성공 응답",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   album: {
                     type: "object",
                     properties: {
                       id: { type: "string", example: "33" },
                       title: { type: "string", example: "Lover" },
                       releaseTime: { type: "string", format: "date-time", example: "2022-10-10T20:36:00.000Z" },
                       image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/d3f083370c371a3ba1cddafaf193c27d.jpg" },
                       createdAt: { type: "string", format: "date-time", example: "2025-02-03T11:22:15.377Z" },
                       updatedAt: { type: "string", format: "date-time", example: "2025-02-03T11:22:15.377Z" }
                     }
                   },
                   artist: { type: "string", example: "Taylor Swift" }
                 }
               }
             }
           }
         }
       }
     }
   };
   #swagger.responses[400] = {
     description: "앨범 목록 조회 실패 응답",
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
    console.log("당신을 위한 앨범 추천을 요청했습니다!");
    const album = await listNomAlbums(req.userId);
    res.send(response(status.SUCCESS, album));
  } catch (err) {
    res.send(response(status.ALBUM_NOT_EXIST, null));
  }
};

//앨범 큐레이션
export const handleAlbumCuration = async (req, res, next) => {
  /*
  #swagger.summary = '앨범 큐레이션 API';
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "앨범 큐레이션 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: {
               type: "object",
               properties: {
                id: { type: "string", example: "1" },
                albumId: { type: "string", example: "1" },
                description: { type: "string", example: "앨범 소개" },
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
     description: "앨범 큐레이션 실패 응답",
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
    console.log("앨범 큐레이션을 요청했습니다!");
    const album = await albumCuration(req.params.album_id);
    res.send(response(status.SUCCESS, album));
  } catch (err) {
    res.send(response(BaseError));
  }
};
//아티스트 큐레이션
export const handleArtistCuration = async (req, res, next) => {
  /*
  #swagger.summary = '아티스트 큐레이션 API';
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "아티스트 큐레이션 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: {
               type: "object",
               properties: {
                id: { type: "string", example: "1" },
                artistId: { type: "string", example: "1" },
                description: { type: "string", example: "아티스트 소개" },
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
     description: "아티스트 큐레이션 실패 응답",
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
    console.log("아티스트 큐레이션을 요청했습니다!");
    const artist = await artistCuration(req.params.artist_id);
    res.send(response(status.SUCCESS, artist));
  } catch (err) {
    res.send(response(BaseError));
  }
};

export const handleGenreImage = async (req, res, next) => {
  /*
  #swagger.summary = '음악 장르 정보 조회 API'
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "장르 정보 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {type: "string", example: "1"},
                  name: { type: "string", example: "afrobeats" },
                  image: { type: "string", example: "https://music-archive-bucket.s3.amazonaws.com/genre/Afrobeats_3.png" }
                }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[500] = {
    description: "서버 에러",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "null", example: null }
          }
        }
      }
    }
  }
*/
  try {
    const urls = await genreImage();
    if (urls) {
      res.send(response(status.SUCCESS, urls));
    } else {
      console.log(urls);
    }
  } catch (err) {
    console.error(err);
  }
};

//앨범 수록곡 조회
export const handleAlbumTrackList = async (req, res, next) => {
  /*
#swagger.summary = '앨범 수록곡 조회 API'
#swagger.tags = ['Music']
#swagger.responses[200] = {
  description: "앨범 상세 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", example: true },
          code: { type: "string", example: "200" },
          message: { type: "string", example: "success!" },
          result: {
            type: "object",
            properties: {
              album: {
                type: "object",
                properties: {
                  id: { type: "string", example: "1" },
                  title: { type: "string", example: "Love Poem - EP" },
                  image: { 
                    type: "string", 
                    example: "https://lastfm.freetls.fastly.net/i/u/300x300/ccd4b26844f8cc08d0dbff410e264533.jpg" 
                  },
                  artistId: { type: "string", example: "1" },
                  artist: { type: "string", example: "IU" },
                  artistImage: { 
                    type: "string", 
                    example: "https://i.scdn.co/image/ab6761610000e5ebbd0642ff425698afac5caffd" 
                  },
                  releaseTime: { type: "number", example: 2019 },
                  totalDuration: { type: "number", example: 25 },
                  trackCount: { type: "number", example: 6 }
                }
              },
              tracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "unlucky" },
                    artist: { type: "string", example: "IU" },
                    image: { 
                      type: "string", 
                      example: "https://lastfm.freetls.fastly.net/i/u/300x300/ccd4b26844f8cc08d0dbff410e264533.jpg" 
                    },
                    releaseTime: { type: "number", example: 2019 }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
#swagger.responses[400] = {
  description: "음악 상세 조회 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", example: false },
          code: { type: "string", example: "MUSIC4001" },
          message: { type: "string", example: "음악이 존재하지 않습니다." },
          result: { type: "null", example: null }
        }
      }
    }
  }
}
#swagger.responses[401] = {
  description: "앨범 상세 조회 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", example: false },
          code: { type: "string", example: "MUSIC4002" },
          message: { type: "string", example: "앨범이 존재하지 않습니다." },
          result: { type: "null", example: null }
        }
      }
    }
  }
}
*/
  try {
    const albumId = req.params.album_id;
    const result = await listAlbumTrackList(albumId);
    res.send(result);
  } catch (err) {
    return next(err);
  }
};

//이 아티스트와 비슷한 아티스트
export const handleArtistSimilar = async (req, res, next) => {
  /*
  #swagger.summary = '이 아티스트와 비슷한 아티스트 조회 API';
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "이 아티스트와 비슷한 아티스트 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  album: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1" },
                      title: { type: "string", example: "Love poem" },
                      releaseTime: { type: "string", format: "date", example: "2025-01-01" },
                      image: { type: "string", example: "https://example.com/album_image.jpg" },
                      createdAt : { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt : { type: "string", format: "date", example: "2025-01-01" },
                    }
                  },
                  artist: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1" },
                      name: { type: "string", example: "IU" },
                      image: { type: "string", example: "https://example.com/artist_image.jpg" },
                      createdAt : { type: "string", format: "date", example: "2025-01-01" },
                      updatedAt : { type: "string", format: "date", example: "2025-01-01" },
                    }
                  },
                }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: "이 아티스트와 비슷한 아티스트 조회 실패 응답",
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
    console.log("이 아티스트와 비슷한 아티스트를 요청했습니다!");
    const artists = await listSimilarArtists(req.params.artist_id);
    res.send(response(status.SUCCESS, artists));
  } catch (err) {
    res.send(response(status.ARTIST_NOT_EXIST, null));
  }
};

//이 아티스트의 다른 앨범
export const handleDifferentAlbum = async (req, res, next) => {
  /*
  #swagger.summary = '이 아티스트의 다른 앨범 조회 API';
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "이 아티스트의 다른 앨범 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "1" },
                  title: { type: "string", example: "Love poem" },
                  releaseTime : { type: "string", format: "date", example: "2021-03-25" },
                  image: { type: "string", example: "https://example.com/album_image.jpg" },
                  createdAt : { type: "string", format: "date", example: "2025-01-01" },
                  updatedAt : { type: "string", format: "date", example: "2025-01-01" },
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
      description: "이 아티스트의 다른 앨범 조회 실패 응답",
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
    console.log("이 아티스트의 다른 앨범을 요청했습니다!");
    const albums = await listDifferentAlbum(
      req.params.artist_id,
      req.params.album_id
    );
    res.send(response(status.SUCCESS, albums));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null));
  }
};

//모든 정보 불러오기
export const handleAllInfo = async (req, res, next) => {
  /*
   #swagger.summary = '모든 정보 조회 API';
   #swagger.tags = ['Music']
   #swagger.parameters['music'] = {
       in: 'query',
       description: '음악 이름',
       required: false,
       type: 'string'
   }
   #swagger.parameters['album'] = {
       in: 'query',
       description: '앨범 이름',
       required: false,
       type: 'string'
   }
   #swagger.parameters['artist'] = {
       in: 'query',
       description: '아티스트 이름',
       required: false,
       type: 'string'
   }
  #swagger.responses[200] = {
    description: "노래 정보 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "object",
              properties: {
                music: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: true },
                    value: { type: "boolean", example: true },
                    info: { type: "object",
                      properties: {
                        id: { type: "string", example: "1" },
                        albumId: { type: "string", example: "1" },
                        title: { type: "string", example: "Celebrity" },
                        releseTime : { type: "string", format: "date", example: "2021-03-25" },
                        lyics: { type: "string", example: "세상의 모서리 구부정하게  커버린 골칫거리 outsider (ah ah)" },
                        image: { type: "string", example: "https://example.com/music_image.jpg" },
                        music: { type: "string", example: "https://example.com/preview_music.m4a"},
                        createdAt : { type: "string", format: "date", example: "2025-01-01" },
                        updatedAt : { type: "string", format: "date", example: "2025-01-01" },
                      }
                    }
                  }
                },
                album: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: true },
                    value: { type: "boolean", example: true },
                    info: { type: "object",
                      properties: {
                        id: { type: "string", example: "1" },
                        title: { type: "string", example: "Love poem" },
                        releseTime : { type: "string", format: "date", example: "2021-03-25" },
                        image: { type: "string", example: "https://example.com/album_image.jpg" },
                        createdAt : { type: "string", format: "date", example: "2025-01-01" },
                        updatedAt : { type: "string", format: "date", example: "2025-01-01" },
                      }
                    }
                  }
                },
                artist: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: true },
                    value: { type: "boolean", example: true },
                    info: { type: "object",
                      properties: {
                        id: { type: "string", example: "1" },
                        name: { type: "string", example: "IU" },
                        image: { type: "string", example: "https://example.com/artist_image.jpg" },
                        createdAt : { type: "string", format: "date", example: "2025-01-01" },
                        updatedAt : { type: "string", format: "date", example: "2025-01-01" },
                      }
                    }
                  }
                },
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "모든 정보 조회 이름이 모두 존재하지 않아 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC4005" },
            message: { type: "string", example: "요청하신 이름이 모두 존재하지 않습니다." },
            result: { 
              type: "object",
              properties: {
                music: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: false },
                    value: { type: "boolean", example: false },
                    info: { type: "object", properties: {}}
                  }
                },
                album: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: false },
                    value: { type: "boolean", example: false },
                    info: { type: "object", properties: {}}
                  }
                },
                artist: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: false },
                    value: { type: "boolean", example: false },
                    info: { type: "object", properties: {}}
                  }
                },
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "모든 정보 조회 값이 모두 존재하지 않아 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC4004" },
            message: { type: "string", example: "요청하신 값이 모두 존재하지 않습니다." },
            result: { 
              type: "object",
              properties: {
                music: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: true },
                    value: { type: "boolean", example: false },
                    info: { type: "object", properties: {}}
                  }
                },
                album: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: true },
                    value: { type: "boolean", example: false },
                    info: { type: "object", properties: {}}
                  }
                },
                artist: {
                  type: "object",
                  properties: {
                    name: { type: "boolean", example: true },
                    value: { type: "boolean", example: false },
                    info: { type: "object", properties: {}}
                  }
                },
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 에러",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "null", example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("정보 불러오기를 요청했습니다!");
    const music = await findMusic(req.query.music);
    const album = await findAlbum(req.query.album);
    const artist = await findArtist(req.query.artist);
    const data = {
      music: music,
      album: album,
      artist: artist,
    };
    if (music.name === false && album.name === false && artist.name === false) {
      res.send(response(status.ALL_NAME_NOT_EXIST, data));
    } else if (
      music.value === false &&
      album.value === false &&
      artist.value === false
    ) {
      res.send(response(status.ALL_VALUE_NOT_EXIST, data));
    } else {
      res.send(response(status.SUCCESS, data));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

//빠른 선곡
export const handleMusicSelection = async (req, res, next) => {
  /*
   #swagger.summary = '빠른 선곡 조회 API';
   #swagger.tags = ['Music']
   #swagger.responses[200] = {
  description: "빠른 선곡 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", example: true },
          code: { type: "string", example: "200" },
          message: { type: "string", example: "success!" },
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                music: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    albumId: { type: "string", example: "1" },
                    title: { type: "string", example: "Love poem" },
                    releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                    lyrics: { type: "string", example: "가사" },
                    image: { type: "string", example: "https://image.png" },
                    music: { type: "string", example: "https://music.m4a" },
                    createdAt: { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                  }
                },
                album: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "1" },
                    title: { type: "string", example: "Love poem" },
                    releaseTime: { type: "string", format: "date", example: "1970-01-01" },
                    image: { type: "string", example: "https://image.png" },
                    createdAt: { type: "string", format: "date", example: "2025-01-01" },
                    updatedAt: { type: "string", format: "date", example: "2025-01-01" }
                  }
                },
                artist: { type: "string", example: "IU" }
              }
            }
          }
        }
      }
    }
  }
};
   #swagger.responses[400] = {
      description: "빠른 선곡 조회 실패 응답",
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
    console.log("빠른 선곡을 요청했습니다!");
    const music = await listSelectionMusic(req.userId);
    res.send(response(status.SUCCESS, music));
  } catch (err) {
    res.send(response(status.MUSIC_NOT_EXIST, null));
  }
};

// 아티스트의 가장 인기곡
export const handleArtistMusicTop = async (req,res,next) => {
  /*
  #swagger.summary = '아티스트의 가장 인기곡을 가져오는 API';
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "아티스트의 가장 인기곡 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  music: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "442" },
                      albumId: { type: "string", example: "439" },
                      title: { type: "string", example: "Super Shy" },
                      releaseTime: { type: "string", example: "2023-10-10T14:56:00.000Z" },
                      lyrics: { type: "string", example: "[00:54.26] I'm super shy, super shy..." },
                      image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/55b73e13e3c3a49647b910111f18eb12.jpg" },
                      music: { type: "string", example: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/f0/c3/73/f0c37318-0928-f8ce-c008-f671f6435067/mzaf_2056463446400078652.plus.aac.p.m4a" },
                      createdAt: { type: "string", example: "2025-02-14T14:18:38.907Z" },
                      updatedAt: { type: "string", example: "2025-02-14T14:18:38.907Z" }
                    }
                  },
                  album: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "439" },
                      title: { type: "string", example: "NewJeans 'Super Shy'" },
                      releaseTime: { type: "string", example: "2023-10-10T14:56:00.000Z" },
                      image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/55b73e13e3c3a49647b910111f18eb12.jpg" },
                      createdAt: { type: "string", example: "2025-02-14T14:18:37.470Z" },
                      updatedAt: { type: "string", example: "2025-02-14T14:18:37.470Z" }
                    }
                  },
                  artist: { type: "string", example: "NewJeans" }
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "아티스트의 인기곡을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "ARTIST_NOT_FOUND" },
            message: { type: "string", example: "해당 아티스트의 인기곡을 찾을 수 없습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "잘못된 아티스트 ID",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "ARTIST_ID_INVALID" },
            message: { type: "string", example: "유효하지 않은 아티스트 ID입니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("아티스트의 가장 인기곡을 요청했습니다!");
    const artists = await listTopMusicArtists(req.params.artist_id);
    res.send(response(status.SUCCESS, artists));
  } catch (err) {
    res.send(response(status.ARTIST_NOT_EXIST, null));
  }
};

// 아티스트의 가장 인기있는 앨범
export const handleArtistAlbumTop = async (req,res,next) => {
  /*
  #swagger.summary = '아티스트의 가장 인기있는 앨범을 가져오는 API';
  #swagger.tags = ['Music']
  #swagger.responses[200] = {
    description: "아티스트의 가장 인기있는 앨범 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "string", example: "200" },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "439" },
                  title: { type: "string", example: "NewJeans 'Super Shy'" },
                  releaseTime: { type: "string", example: "2023-10-10T14:56:00.000Z" },
                  image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/55b73e13e3c3a49647b910111f18eb12.jpg" },
                  createdAt: { type: "string", example: "2025-02-14T14:18:37.470Z" },
                  updatedAt: { type: "string", example: "2025-02-14T14:18:37.470Z" }
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "아티스트의 인기 앨범을 찾을 수 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "ARTIST_NOT_EXIST" },
            message: { type: "string", example: "해당 아티스트의 인기 앨범을 찾을 수 없습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "잘못된 아티스트 ID",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "ARTIST_ID_INVALID" },
            message: { type: "string", example: "유효하지 않은 아티스트 ID입니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("아티스트의 가장 인기 앨범을 요청했습니다!");
    const artists = await listTopAlbumArtists(req.params.artist_id);
    res.send(response(status.SUCCESS, artists));
  } catch (err) {
    res.send(response(status.ARTIST_NOT_EXIST, null));
  }
};