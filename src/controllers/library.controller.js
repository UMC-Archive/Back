import {
  listLibraryMusics,
  listLibraryArtists,
  listLibraryAlbums,
} from "../services/library.service.js";

export const handleLibraryMusic = async (req, res, next) => {
  /*
  #swagger.summary = '보관함 음악 조회 API'
  #swagger.tags = ['Library']
  #swagger.responses[200] = {
    description: "보관함 음악 조회 성공 응답",
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
                  title: { type: "string", example: "Dance With Me" },
                  releaseTime: { type: "number", example: 2000 },
                  image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/c354ecbb79a91abeb79f7c53d46c05ca.jpg" },
                  artist: { type: "string", example: "Mya" }
                }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: "보관함 음악 조회 실패 응답",
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
    console.log("보관함 음악 조회를 요청했습니다!");
    const musics = await listLibraryMusics(req.userId);
    const statusCode = musics.isSuccess ? 200 : "SIGNIN4002" ? 404 : 500;
    return res.status(statusCode).json(musics);
  } catch (err) {
    next(err);
  }
};

export const handleLibraryArtist = async (req, res, next) => {
  /*
  #swagger.summary = '보관함 아티스트 조회 API'
  #swagger.tags = ['Library']
  #swagger.security = [{
     "Bearer": []
  }]
  #swagger.responses[200] = {
    description: "보관함 아티스트 조회 성공 응답",
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
                  name: { type: "string", example: "Creed" },
                  image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png" }
                }
              },
              description: "사용자가 보관함에 아티스트를 추가하지 않았을 경우 null"
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: "보관함 아티스트 조회 실패 응답",
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
    console.log("보관함 아티스트 조회를 요청했습니다!");
    const artists = await listLibraryArtists(req.userId);
    const statusCode = artists.isSuccess ? 200 : "SIGNIN4002" ? 400 : 500;
    return res.status(statusCode).json(artists);
  } catch (err) {
    next(err);
  }
};

export const handleLibraryAlbum = async (req, res, next) => {
  try {
    /*
#swagger.summary = '보관함 앨범 조회 API'
#swagger.tags = ['Library']
#swagger.security = [{
 "Bearer": []
}]
#swagger.responses[200] = {
 description: "보관함 앨범 조회 성공 응답",
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
               title: { type: "string", example: "O-Town" },
               image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/67836e68e0c230a44bf6d2cf9df1ae24.jpg" },
               artist: { type: "string", example: "Creed" }
             }
           },
           description: "사용자가 보관함에 앨범을 추가하지 않았을 경우 null"
         }
       }
     }
   }
 }
}
#swagger.responses[400] = {
 description: "보관함 앨범 조회 실패 응답", 
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
    console.log("보관함 앨범 조회를 요청했습니다!");
    const albums = await listLibraryAlbums(req.userId);
    const statusCode = albums.isSuccess ? 200 : "SIGNIN4002" ? 404 : 500;
    return res.status(statusCode).json(albums);
  } catch (err) {
    next(err);
  }
};
