import {
  listLibraryMusics,
  listLibraryArtists,
  listLibraryAlbums,
  addMusicLibraryService,
  addAlbumLibraryService,
  addArtistLibraryService,
  deleteMusicLibraryService,
  deleteAlbumLibraryService,
  deleteArtistLibraryService
} from "../services/library.service.js";
import { checkFormat } from "../middleware/jwt.js";

//보관함 노래 삭제
export const deleteMusicLibrary = async (req, res) => {
  /*
  #swagger.summary = '보관함에서 노래 삭제 API';
  #swagger.tags = ['Library']
  #swagger.parameters['Authorization'] = {
    in: 'header',
    description: '액세스 토큰 (Bearer Token)',
    required: true,
    type: 'string',
    example: 'Bearer <액세스_토큰>'
  }
  #swagger.parameters['musicId'] = {
    in: 'path',
    description: '삭제할 노래의 ID',
    required: true,
    type: 'integer',
    example: 44
  }
  #swagger.responses[200] = {
    description: "노래 삭제 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "보관함에 해당 노래가 존재하지 않는 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC007" },
            message: { type: "string", example: "보관함에 해당 노래가 존재하지 않습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 오류 발생",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try{
    console.log("보관함에서 노래를 삭제합니다.");
    const musicId = req.params.musicId;
    // console.log(req.userId);
    // console.log(musicId);
    const result = await deleteMusicLibraryService(req.userId, musicId);
    return res.json(result);
  }catch(err){
    return res.json(result);
  }
}
//보관함 앨범 삭제
export const deleteAlbumLibrary = async (req, res) => {
  /*
  #swagger.summary = '보관함에서 앨범 삭제 API';
  #swagger.tags = ['Library']
  #swagger.parameters['Authorization'] = {
    in: 'header',
    description: '액세스 토큰 (Bearer Token)',
    required: true,
    type: 'string',
    example: 'Bearer <액세스_토큰>'
  }
  #swagger.parameters['albumId'] = {
    in: 'path',
    description: '삭제할 앨범의 ID',
    required: true,
    type: 'integer',
    example: 4
  }
  #swagger.responses[200] = {
    description: "앨범 삭제 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "보관함에 해당 앨범이 존재하지 않는 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC008" },
            message: { type: "string", example: "보관함에 해당 앨범이 존재하지 않습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 오류 발생",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try{
    console.log("보관함에서 앨범을 삭제합니다.");
    const albumId = req.params.albumId;
    // console.log(req.userId);
    // console.log(musicId);
    const result = await deleteAlbumLibraryService(req.userId, albumId);
    return res.json(result);
  }catch(err){
    return res.json(result);
  }
}
//보관함 아티스트 삭제
export const deleteArtistLibrary = async (req, res) => {
  /*
  #swagger.summary = '보관함에서 아티스트 삭제 API';
  #swagger.tags = ['Library']
  #swagger.parameters['Authorization'] = {
    in: 'header',
    description: '액세스 토큰 (Bearer Token)',
    required: true,
    type: 'string',
    example: 'Bearer <액세스_토큰>'
  }
  #swagger.parameters['artistId'] = {
    in: 'path',
    description: '삭제할 아티스트의 ID',
    required: true,
    type: 'integer',
    example: 7
  }
  #swagger.responses[200] = {
    description: "아티스트 삭제 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
             isSuccess: { type: "boolean", example: true },
             code: { type: "string", example: "200" },
             message: { type: "string", example: "success!" },
             result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "보관함에 해당 아티스트가 존재하지 않는 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC009" },
            message: { type: "string", example: "보관함에 해당 아티스트가 존재하지 않습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 오류 발생",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try{
    console.log("보관함에서 아티스트를 삭제합니다.");
    const artistId = req.params.artistId;
    // console.log(req.userId);
    // console.log(musicId);
    const result = await deleteArtistLibraryService(req.userId, artistId);
    return res.json(result);
  }catch(err){
    return res.json(result);
  }
}

export const addMusicLibrary = async (req, res) =>{
/*
  #swagger.summary = '보관함에 노래 추가 API';
  #swagger.tags = ['Library']
  #swagger.parameters['Authorization'] = {
    in: 'header',
    description: '액세스 토큰 (Bearer Token)',
    required: true,
    type: 'string',
    example: 'Bearer <액세스_토큰>'
  }
  #swagger.parameters['musicId'] = {
    in: 'path',
    description: '추가할 노래의 ID',
    required: true,
    type: 'integer',
    example: 44
  }
  #swagger.responses[200] = {
    description: "노래 추가 성공 응답",
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
                id: { type: "string", example: "24" },
                libraryId: { type: "string", example: "1" },
                musicId: { type: "string", example: "44" },
                createdAt: { type: "string", format: "date-time", example: "2025-02-06T08:07:10.950Z" },
                updatedAt: { type: "string", format: "date-time", example: "2025-02-06T08:07:10.950Z" }
             }
            } 
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "보관함에 이미 음악이 존재할 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC004" },
            message: { type: "string", example: "보관함에 음악이 이미 존재합니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 오류 발생",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/

  try{
    console.log('보관함에 노래를 추가합니다.');
    const token = await checkFormat(req.get("Authorization"));
    const musicId = req.params.musicId;
    // console.log(req.userId);
    // console.log(musicId);
    const result = await addMusicLibraryService(req.userId, musicId);
    return res.json(result);
  }catch(err){
    return res.json(result);
  }
}

export const addAllbumLibrary = async (req, res) =>{
  /*
  #swagger.summary = '보관함에 앨범 추가 API';
  #swagger.tags = ['Library']
  #swagger.parameters['Authorization'] = {
    in: 'header',
    description: '액세스 토큰 (Bearer Token)',
    required: true,
    type: 'string',
    example: 'Bearer <액세스_토큰>'
  }
  #swagger.parameters['albumId'] = {
    in: 'path',
    description: '추가할 앨범의 ID',
    required: true,
    type: 'integer',
    example: 4
  }
  #swagger.responses[200] = {
    description: "앨범 추가 성공 응답",
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
                id: { type: "string", example: "10" },
                libraryId: { type: "string", example: "1" },
                albumId: { type: "string", example: "4" },
                createdAt: { type: "string", format: "date-time", example: "2025-02-06T08:07:10.950Z" },
                updatedAt: { type: "string", format: "date-time", example: "2025-02-06T08:07:10.950Z" }
             }
            } 
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "보관함에 이미 앨범이 존재할 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC005" },
            message: { type: "string", example: "보관함에 앨범이 이미 존재합니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 오류 발생",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try{
    console.log('보관함에 앨범을 추가합니다.');
    const token = await checkFormat(req.get("Authorization"));
    const albumId = req.params.albumId;
    // console.log(req.userId);
    const result = await addAlbumLibraryService(req.userId, albumId);
    // console.log(result);
    return res.json(result);
  }catch(err){
    return res.json(result);
  }
}

export const addArtistLibrary = async (req, res) =>{
  /*
  #swagger.summary = '보관함에 아티스트 추가 API';
  #swagger.tags = ['Library']
  #swagger.parameters['Authorization'] = {
    in: 'header',
    description: '액세스 토큰 (Bearer Token)',
    required: true,
    type: 'string',
    example: 'Bearer <액세스_토큰>'
  }
  #swagger.parameters['artistId'] = {
    in: 'path',
    description: '추가할 아티스트의 ID',
    required: true,
    type: 'integer',
    example: 7
  }
  #swagger.responses[200] = {
    description: "아티스트 추가 성공 응답",
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
                id: { type: "string", example: "15" },
                libraryId: { type: "string", example: "1" },
                artistId: { type: "string", example: "7" },
                createdAt: { type: "string", format: "date-time", example: "2025-02-06T08:07:10.950Z" },
                updatedAt: { type: "string", format: "date-time", example: "2025-02-06T08:07:10.950Z" }
             }
            } 
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "보관함에 이미 아티스트가 존재할 경우",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "MUSIC006" },
            message: { type: "string", example: "보관함에 아티스트가 이미 존재합니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "서버 오류 발생",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "COMMON000" },
            message: { type: "string", example: "서버 에러, 관리자에게 문의 바랍니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try{
    console.log('보관함에 아티스트를를 추가합니다.');
    const token = await checkFormat(req.get("Authorization"));
    const artistId = req.params.artistId;
    // console.log(req.userId);
    const result = await addArtistLibraryService(req.userId, artistId);
    // console.log(result);
    return res.json(result);
  }catch(err){
    return res.json(result);
  }
}

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
