import { listLibraryMusics } from "../services/library.service.js";

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
    console.log("musics:", JSON.stringify(musics, null, 2));

    const statusCode = musics.isSuccess ? 200 : "SIGNIN4002" ? 404 : 500;
    return res.status(statusCode).json(musics);
  } catch (err) {
    next(err);
  }
};
