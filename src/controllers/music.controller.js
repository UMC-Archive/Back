import { StatusCodes } from "http-status-codes";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {} from "../dtos/music.dto.js";
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
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: {
              type: "array",
              items: {
               type: "object", 
                properties: { 
                  music: {
                    type: "object",  
                    properties: {
                      id: { type: "number", example: 1 },
                      albumId: { type: "number", example: 1 },
                      title: { type: "string", example: "Celebrity" },
                      releaseTime: { type: "string", format: "date", example: "2021-03-25" },
                      lyrics: { type: "string", example: "세상의 모서리 구부정하게  커버린 골칫거리 outsider (ah ah)" },
                      image: { type: "string", example: "https://example.com/music_image.jpg" },
                     music: { type: "string", example: "https://example.com/preview_music.m4a" },
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
    const artist = await listArtist(req.query.artist_name);
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
   #swagger.parameters['user_id'] = {
       in: 'query',
       description: '사용자 ID',
       required: true,
       type: 'string'
   }
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
      const result = await listSpecificArtistInfo(user_id, artist);
      const statusCode = result.isSuccess ? 200 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (err) {
    return next(err);
  }
};

// 음악 콘텐츠 추천
export const handleCommonMusicNomination = async (req, res, next) => {
  try {
    console.log("추천곡 조회를 요청했습니다!");
    const music_name = req.query.music;
    const artist_name = req.query.artist;

    if (!music_name || !artist_name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        resultType: "FAIL",
        error: {
          errorCode: "BAD_REQUEST",
          reason: "음악 제목과 아티스트 이름이 필요합니다",
          data: null,
        },
        success: null,
      });
    }

    const similarMusics = await listNomMusics(music_name, artist_name);

    return res.status(StatusCodes.OK).json({
      musics: similarMusics,
    });
  } catch (error) {
    next(error);
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
