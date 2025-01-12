//추천곡
export const handleMusicNomination = async (req, res, next) => {
    /*
     #swagger.summary = '추천곡 조회 API';
     #swagger.responses[200] = {
       description: "추천곡 조회 성공 응답",
       content: {
         "application/json": {
           schema: {
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
     };
     #swagger.responses[404] = {
       description: "노래 정보를 찾을 수 없음",
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               resultType: { type: "string", example: "FAIL" },
               error: {
                 type: "object",
                 properties: {
                   errorCode: { type: "string", example: "U404" },
                   reason: { type: "string", example: "노래를 찾을 수 없습니다." },
                   data: { type: "object", example: {} }
                 }
               },
               success: { type: "object", nullable: true, example: null }
             }
           }
         }
       }
     };
   */
}
//당신을 위한 앨범 추천
export const handleAlbumNomination = async (req, res, next) => {
    /*
     #swagger.summary = '당신을 위한 앨범 추천 조회 API';
     #swagger.responses[200] = {
       description: "당신을 위한 앨범 추천 조회 성공 응답",
       content: {
         "application/json": {
           schema: {
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
     };
     #swagger.responses[404] = {
       description: "노래 정보를 찾을 수 없음",
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               resultType: { type: "string", example: "FAIL" },
               error: {
                 type: "object",
                 properties: {
                   errorCode: { type: "string", example: "U404" },
                   reason: { type: "string", example: "노래를 찾을 수 없습니다." },
                   data: { type: "object", example: {} }
                 }
               },
               success: { type: "object", nullable: true, example: null }
             }
           }
         }
       }
     };
   */
}
//숨겨진 명곡
export const handleMusicHidden = async (req, res, next) => {
    /*
     #swagger.summary = '숨겨진 명곡 조회 API';
     #swagger.responses[200] = {
       description: "숨겨진 명곡 조회 성공 응답",
       content: {
         "application/json": {
           schema: {
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
     };
     #swagger.responses[404] = {
       description: "숨겨진 명곡 정보를 찾을 수 없음",
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               resultType: { type: "string", example: "FAIL" },
               error: {
                 type: "object",
                 properties: {
                   errorCode: { type: "string", example: "U404" },
                   reason: { type: "string", example: "노래를 찾을 수 없습니다." },
                   data: { type: "object", example: {} }
                 }
               },
               success: { type: "object", nullable: true, example: null }
             }
           }
         }
       }
     };
   */
}
//노래 정보 가져오기
export const handleMusicInfo = async (req, res, next) => {
    /*
     #swagger.summary = '노래 정보 조회 API';
     #swagger.responses[200] = {
       description: "노래 정보 조회 성공 응답",
       content: {
         "application/json": {
           schema: {
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
     };
     #swagger.responses[404] = {
       description: "노래 정보를 찾을 수 없음",
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               resultType: { type: "string", example: "FAIL" },
               error: {
                 type: "object",
                 properties: {
                   errorCode: { type: "string", example: "U404" },
                   reason: { type: "string", example: "노래를 찾을 수 없습니다." },
                   data: { type: "object", example: {} }
                 }
               },
               success: { type: "object", nullable: true, example: null }
             }
           }
         }
       }
     };
   */
}
//앨범 정보 가져오기
export const handleMusicAlbumInfo = async (req, res, next) => {
    /*
     #swagger.summary = '앨범 정보 조회 API';
     #swagger.responses[200] = {
       description: "앨범 정보 조회 성공 응답",
       content: {
         "application/json": {
           schema: {
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
     };
     #swagger.responses[404] = {
       description: "앨범 정보를 찾을 수 없음",
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               resultType: { type: "string", example: "FAIL" },
               error: {
                 type: "object",
                 properties: {
                   errorCode: { type: "string", example: "U404" },
                   reason: { type: "string", example: "앨범을 찾을 수 없습니다." },
                   data: { type: "object", example: {} }
                 }
               },
               success: { type: "object", nullable: true, example: null }
             }
           }
         }
       }
     };
   */
}
//아티스트 정보 가져오기
export const handleMusicArtistInfo = async (req, res, next) => {
    /*
      #swagger.summary = '아티스트 정보 조회 API';
      #swagger.responses[200] = {
        description: "아티스트 정보 조회 성공 응답",
        content: {
          "application/json": {
            schema: {
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
      };
      #swagger.responses[404] = {
        description: "아티스트 정보를 찾을 수 없음",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "U404" },
                    reason: { type: "string", example: "아티스트를 찾을 수 없습니다." },
                    data: { type: "object", example: {} }
                  }
                },
                success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      };
    */
}