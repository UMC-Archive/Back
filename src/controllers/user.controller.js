import { StatusCodes } from "http-status-codes";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { checkFormat } from "../middleware/jwt.js";
import { BaseError } from "../errors.js";
import {
  bodyToUser,
  loginRequestDTO,
  bodyToImageDTO,
  checkVerificationRequestDTO,
  bodyToGenreDTO,
  bodyToArtistDTO,
  bodyToUserMusic,
  bodyToHistoryDTO,
} from "../dtos/user.dto.js";
import {
  userSignUp,
  loginService,
  sendVerificationCode,
  userInfoService,
  checkVerificationCode,
  userChangeImageService,
  userChangeGenreService,
  userChangeArtistService,
  userProfile,
  userPlay,
  userAddHistoryService,
  userHistoryInfoService,
  addRecentMusicService,
  getGenreForMusic,
  listReacapMusics,
  listUserPreferGenre,
} from "../services/user.service.js";

import { 
  listLibraryMusics 
} from "../services/library.service.js";
//회원가입
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "binary",
                description: "프로필 이미지 파일"
              },
              data: {
                type: "object",
                    properties: {
                      nickname: { type: "string", example: "닉네임" },
                      email: { type: "string", example: "example@email.com"},
                      password: { type: "string", example: "password"},
                      status: { type: "string", example: "active"},
                      socialType: { type: "string", example: "local"},
                      inactiveDate: { type: "string", format: "date" },
                      artists: {type: "array", items: { type: "number", example: "1" } },
                      genres: { type: "array", items: { type: "number", example: "1" } },
                    },
                    description: "사용자 정보(JSON 형태)"
              }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: true },
              code: { type: "number", example: 200 },
              message:{ type: "string", example: "success!" },
              result: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1"},
                      nickname: { type: "string", example: "닉네임" },
                      email: { type: "string", example: "example@email.com"},
                      password: { type: "string", example: "$2b$10$o8SHav4KiPRDtC0XEMyKm.EqVSZmALYfCH2lrrDaWqeR33j37vmoC"},
                      profileImage: { type: "string", example: "https://example.com/image.jpg"},
                      status: { type: "string", example: "active"},
                      socialType: { type: "string", example: "local"},
                      inactiveDate: { type: "string",  format: "date"  },
                      createdAt: { type: "string",  format: "date" },
                      updatedAt: { type: "string",  format: "date" },
                    }
                  },
                  artists: {type: "array", items: { type: "string", example: "IU" } },
                  genres: { type: "array", items: { type: "string", example: "pop" } },
                  library: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1"},
                      userId: { type: "string", example: "1"},
                      createdAt: { type: "string",  format: "date" },
                      updatedAt: { type: "string",  format: "date" },
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
      description: "회원 가입 이메일 중복 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MEMBER4003" },
              message: { type: "string", example: "이미 가입된 이메일이 존재합니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try {
    console.log("회원가입을 요청했습니다!");
    const user = await userSignUp(req, res);
    if (user === null) {
      res.send(response(status.EMAIL_ALREADY_EXIST, null));
    } else if (user.info === false) {
      res.send(response(status.MEMBER_NOT_FOUND, null));
    } else {
      res.send(response(status.SUCCESS, user));
    }
  } catch (err) {
    //console.error(err)
  }
};

// 로그인
export const handleLogin = async (req, res, next) => {
  /*
  #swagger.summary = '사용자 로그인 API';
  #swagger.tags = ['User']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string", example: "example@email.com" },
            password: { type: "string", example: "password" }
          },
          required: ["email", "password"]
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "로그인 성공 응답",
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
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "이메일이 존재하지 않음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "LOGIN_ID_NOT_EXIST" },
            message: { type: "string", example: "이메일이 존재하지 않습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[401] = {
    description: "비밀번호가 일치하지 않음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "LOGIN_PASSWORD_WRONG" },
            message: { type: "string", example: "비밀번호가 틀렸습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("로그인");
    const result = await loginService(loginRequestDTO(req.body));
    if (result === 1) {
      // ID = EMAIL
      res.send(response(status.LOGIN_ID_NOT_EXIST, null));
    } else if (result === 2) {
      // if login fail by password incorrect
      res.send(response(status.LOGIN_PASSWORD_WRONG, null));
    } else {
      // if login success
      res.send(response(status.SUCCESS, result));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};
//이메일 인증 전송
// /users/signup/email/send-verification-code
export const sendEmail = async (req, res) => {
  /*
      #swagger.summary = '이메일 인증번호 전송 API';
      #swagger.tags = ['User']
      #swagger.description = '사용자가 입력한 이메일 주소로 인증번호를 전송하는 API입니다.';
      #swagger.parameters['email'] = {
        in: 'query',
        description: '인증번호를 전송할 이메일 주소',
        required: true,
        type: 'string',
        example: 'example@domain.com'
      };
      #swagger.responses[200] = {
        description: '이메일 인증번호 전송 성공 응답',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                message: { type: "string", example: "success!" },
                result: { type: "string", example: "암호화된 인증번호" },
                isSuccess: { type: "boolean", example: true }
              }
            }
          }
        }
      };
      #swagger.responses[400] = {
        description: '이메일 인증번호 전송 실패 응답',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "string", example: "MEMBER4003" },
                message: { type: "string", example: "이미 가입된 이메일이 존재합니다." },
                result: { type: "object", nullable: true, example: null },
                isSuccess: { type: "boolean", example: false }
              }
            }
          }
        }
      };
*/
  try {
    let encryptedCode = await sendVerificationCode(req.param("email"));

    if (encryptedCode !== null) {
      // if email doesn't exists
      console.log(encryptedCode);

      // res.status(StatusCodes.OK);
      res.send(response(status.SUCCESS, encryptedCode));
    } else {
      // if email exists
      res.send(response(status.EMAIL_ALREADY_EXIST, null));
      // res.status(StatusCodes.OK);
    }
  } catch (err) {
    console.log(err);
    res.send(response(status.BAD_REQUEST, null));
  }
};

// 인증번호 확인
export const checkVerification = async (req, res) => {
  /*
      #swagger.summary = '이메일 인증번호 확인 API';
      #swagger.tags = ['User']
      #swagger.description = '사용자가 입력한 인증번호를 서버에서 암호화된 코드와 비교하여 유효성을 확인하는 API입니다.';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                cipherCode: { type: "string", description: "암호화된 인증 코드" },
                code: { type: "string", description: "사용자가 입력한 인증 코드", example: "123456" }
              },
              required: ["cipherCode", "code"]
            }
          }
        }
      };
      #swagger.responses[200] = {
        description: '이메일 인증번호 확인 성공 응답',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "number", example: 200 },
                message: { type: "string", example: "success!" },
                result: { type: "object", nullable: true, example: null },
                isSuccess: { type: "boolean", example: true }
              }
            }
          }
        }
      };
      #swagger.responses[400] = {
        description: '이메일 인증번호 확인 실패 응답',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "string", example: "MEMBER4004" },
                message: { type: "string", example: "코드가 일치하지 않습니다." },
                result: { type: "object", nullable: true, example: null },
                isSuccess: { type: "boolean", example: false }
              }
            }
          }
        }
      };
*/
  try {
    if (await checkVerificationCode(checkVerificationRequestDTO(req.body))) {
      // if code correct
      res.send(response(status.SUCCESS, null));
    } else {
      // if code incorrect
      res.send(response(status.CODE_NOT_CORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(status.AUTH_ERROR, null));
  }
};

// 유저 정보 불러오기
export const handleUserInfo = async (req, res) => {
  console.log("유저 정보를 불러옵니다.");
  /*
  #swagger.summary = '유저 정보 조회 API';
  #swagger.tags = ['User']
  #swagger.description = '토큰을 사용하여 로그인한 사용자의 정보를 가져오는 API입니다.'
  #swagger.responses[200] = {
    description: "유저 정보 조회 성공 응답",
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
                id: { type: "string", example: "1" },
                nickname: { type: "string", example: "닉네임" },
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "hidden" },
                profileImage: { type: "string", example: "https://example.com/image.jpg" },
                status: { type: "string", example: "active" },
                socialType: { type: "string", example: "local" },
                inactiveDate: { type: "string", format: "date-time" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[401] = {
    description: "토큰이 올바르지 않거나 없음",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
            message: { type: "string", example: "토큰 형식이 올바르지 않습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("유저 정보를 불러옵니다.");
    console.log(req.get("Authorization"));
    const token = await checkFormat(req.get("Authorization"));
    console.log(token, ":test");
    if (token !== null) {
      // 토큰 이상없음
      res.send(response(status.SUCCESS, await userInfoService(req.userId)));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

// 유저 프로필 이미지 변경
export const handleUserChangeImage = async (req, res, next) => {
/*
    #swagger.summary = '유저 프로필 이미지 변경 API';
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "binary",
                description: "새로운 프로필 이미지 파일"
              },
              data: {
                type: "object",
                properties: {
                  nickname: { type: "string", example: "닉네임" }
                },
                description: "사용자 정보(JSON 형태)"
              }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "프로필 이미지 변경 성공 응답",
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
                  id: { type: "string", example: "1" },
                  nickname: { type: "string", example: "닉네임" },
                  email: { type: "string", example: "example@email.com" },
                  password: { type: "string", example: "$2b$10$I12yq02leVVPozyP1/sKQeSEf/9Tv.q1zUeuS8l5Q9tH.mMidzl8e" },
                  profileImage: { 
                    type: "string", 
                    example: "https://music-archive-bucket.s3.ap-northeast-2.amazonaws.com/archive/1739500725587-MixGolem.png" 
                  },
                  status: { type: "string", example: "active" },
                  socialType: { type: "string", example: "local" },
                  inactiveDate: { type: "string", format: "date-time", example: "2025-02-13T00:00:00.000Z" },
                  createdAt: { type: "string", format: "date-time", example: "2025-02-13T15:16:55.612Z" },
                  updatedAt: { type: "string", format: "date-time", example: "2025-02-14T02:38:46.020Z" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "해당 닉네임으로 등록된 사용자가 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "USER_NOT_FOUND" },
              message: { type: "string", example: "해당 닉네임으로 등록된 사용자가 없습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "토큰이 올바르지 않거나 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
              message: { type: "string", example: "토큰 형식이 올바르지 않습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
*/
  try {
    console.log("유저의 프로필 이미지 변경을 요청했습니다!");
    const token = await checkFormat(req.get("Authorization"));
    if (token !== null) {
      // 토큰 이상없음
      const changeImage = await userChangeImageService(
        req,
        res,
      );
      res.send(response(status.SUCCESS, changeImage));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

// 유저의 장르 선택/수정
export const handleUserGenre = async (req, res, next) => {
  /*
  #swagger.summary = '유저의 장르 선택/수정 API'
  #swagger.tags = ['User']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            genreId: { type: "integer", example: 1, description: "선택 또는 수정할 장르의 ID" }
          },
          required: ["genreId"]
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: '장르 변경 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: {
              type: 'object',
              properties: {
                userId: { type: 'integer', example: 1 },
                genreId: { type: 'integer', example: 2 },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  }
    #swagger.responses[401] = {
      description: "토큰이 올바르지 않거나 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
              message: { type: "string", example: "토큰 형식이 올바르지 않습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
*/

  try {
    console.log("유저가 장르 변경을 요청했습니다!");
    console.log(req.get("Authorization"));
    const token = await checkFormat(req.get("Authorization"));
    console.log(token, ":test");
    if (token !== null) {
      // 토큰 이상없음
      const changeGenre = await userChangeGenreService(
        bodyToGenreDTO(req.userId, req.body)
      );
      res.send(response(status.SUCCESS, changeGenre));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

// 유저의 아티스트 선택/수정
export const handleUserArtist = async (req, res, next) => {
  /*
    #swagger.summary = '유저의 아티스트 선택/수정 API'
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              artistId: { type: "integer", example: 1, description: "선택 또는 수정할 아티스트의 ID" }
            },
            required: ["artistId"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '아티스트 선택/수정 성공',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                isSuccess: { type: "boolean", example: true },
                code: { type: "number", example: 200 },
                message: { type: "string", example: "success!" },
                result: {
                type: 'object',
                properties: {
                  userId: { type: 'integer', example: 1 },
                  artistId: { type: 'integer', example: 1 },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: 'string', format: 'date-time', example: '2024-02-01T12:34:56Z' }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[401] = {
        description: "토큰이 올바르지 않거나 없음",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isSuccess: { type: "boolean", example: false },
                code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
                message: { type: "string", example: "토큰 형식이 올바르지 않습니다." },
                result: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      };
    */
  try {
    console.log("유저가 아티스트 변경을 요청했습니다!");
    console.log(req.get("Authorization"));
    const token = await checkFormat(req.get("Authorization"));
    console.log(token, ":test");
    if (token !== null) {
      // 토큰 이상없음
      const changeArtist = await userChangeArtistService(
        bodyToArtistDTO(req.userId, req.body)
      );
      res.send(response(status.SUCCESS, changeArtist));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

// 유저의 사진을 업로드 하는 api
export const handleUserProfile = async (req, res, next) => {
  /*
  #swagger.summary = '유저의 사진을 업로드하는 API';
  #swagger.tags = ['User']
  #swagger.responses[200] = {
    description: "업로드 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: true },
            code: { type: "number", example: 200 },
            message: { type: "string", example: "success!" },
            result: { type: "string", example: "https://music-archive-bucket.s3.ap-northeast-2.amazonaws.com/archive/1737601876496-icon.png" }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
      description: "업로드 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "MEMBER4004" },
              message: { type: "string", example: "파일이 존재하지 않습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */

  try {
    console.log("유저의 사진을 업로드를 요청했습니다!");
    const url = await userProfile(req, res);
    if (url) {
      res.send(response(status.SUCCESS, url));
    } else {
      res.send(response(status.FILE_NOT_EXIST, null));
    }
  } catch (err) {
    res.send(response(status.FILE_NOT_EXIST, null));
  }
};

// 유저의 음악 재생 시 기록하기
export const handleUserPlay = async (req, res, next) => {
  /*
    #swagger.summary = '유저의 음악 재생 시 기록하기 API';
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              musicId: {type: "number", example: 1 },
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
        description: '유저의 음악 재생 시 기록하기 성공 응답',
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
                    id: { type: "string", example: "1"},
                    userId: { type: "string", example: "1"},
                    musicId: { type: "string", example: "1"},
                    createdAt: { type: "string",  format: "date" },
                    updatedAt: { type: "string",  format: "date" },
                  }
                }
              }
            }
          }
        }
      };
      #swagger.responses[400] = {
        description: '유저의 음악 재생 시 기록하기 실패 응답',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isSuccess: { type: "boolean", example: false },
                code: { type: "string", example: "MUSIC4002" },
                message: { type: "string", example: "앨범이 존재하지 않습니다." },
                result: { type: "object", nullable: true, example: null },
              }
            }
          }
        }
      };
  */
  try {
    console.log("유저의 음악 재생 시 기록하기를 요청했습니다!");
    const userMusic = await userPlay(bodyToUserMusic(req.userId, req.body));
    res.send(response(status.SUCCESS, userMusic));
    const genre = await getGenreForMusic(bodyToUserMusic(req.userId, req.body));
  } catch (err) {
    res.send(response(status.ALBUM_NOT_EXIST, null));
  }
};

// 유저의 연도 타임 히스토리 기록하기
export const handleHistory = async (req, res, next) => {
  /*
  #swagger.summary = '유저 타임 히스토리 추가 API';
  #swagger.tags = ['User']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            history: { 
              type: "string", 
              format: "date", 
              example: "2025-02-02T00:00:00Z",
              description: "타임 히스토리 기록 날짜"
            }
          },
          required: ["history"]
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: '유저 타임 히스토리 추가 성공 응답',
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
                id: { type: "string", example: "1" },
                userId: { type: "string", example: "1" },
                history: { type: "string", format: "date", example: "2025-02-02T00:00:00Z" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '토큰 포맷 오류 응답',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
            message: { type: "string", example: "토큰 포맷이 올바르지 않습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: '사용자를 찾을 수 없음 응답',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "USER_NOT_FOUND" },
            message: { type: "string", example: "해당 이름으로 등록된 사용자가 없습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: '서버 오류 응답',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: { type: "boolean", example: false },
            code: { type: "string", example: "INTERNAL_SERVER_ERROR" },
            message: { type: "string", example: "서버 오류가 발생했습니다." },
            result: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("유저의 연도 타임 히스토리 추가를 요청했습니다!");
    console.log(req.get("Authorization"));
    const token = await checkFormat(req.get("Authorization"));
    console.log(token, ":test");
    if (token !== null) {
      // 토큰 이상없음
      const addHistory = await userAddHistoryService(
        bodyToHistoryDTO(req.userId, req.body)
      );
      res.send(response(status.SUCCESS, addHistory));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

// 유저 히스토리 불러오기
export const handleGetHistory = async (req, res, next) => {
  /*
    #swagger.summary = '유저 타임 히스토리 불러오기 API';
    #swagger.tags = ['User']
    #swagger.responses[200] = {
      description: '유저 타임 히스토리 조회 성공 응답',
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
                    userId: { type: "string", example: "1" },
                    history: { type: "string", example: "2024-01-01T00:00:00.000Z" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          },
          example: {
            isSuccess: true,
            code: 200,
            message: "success!",
            result: [
              {
                id: "16",
                userId: "1",
                history: "2010-02-02T00:00:00.000Z",
                createdAt: "2025-02-11T06:59:16.830Z",
                updatedAt: "2025-02-11T06:59:16.830Z"
              },
              {
                id: "15",
                userId: "1",
                history: "1984-06-08T00:00:00.000Z",
                createdAt: "2025-02-10T15:58:32.008Z",
                updatedAt: "2025-02-10T15:58:32.008Z"
              },
              {
                id: "14",
                userId: "1",
                history: "1986-12-22T00:00:00.000Z",
                createdAt: "2025-02-10T15:58:00.421Z",
                updatedAt: "2025-02-10T15:58:00.421Z"
              },
              {
                id: "13",
                userId: "1",
                history: "1980-01-01T00:00:00.000Z",
                createdAt: "2025-02-10T15:56:49.877Z",
                updatedAt: "2025-02-10T15:56:49.877Z"
              },
              {
                id: "12",
                userId: "1",
                history: "1980-01-01T00:00:00.000Z",
                createdAt: "2025-02-10T06:00:27.027Z",
                updatedAt: "2025-02-10T06:00:27.027Z"
              }
            ]
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: '토큰 포맷 오류 응답',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
              message: { type: "string", example: "토큰 포맷이 올바르지 않습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: '사용자를 찾을 수 없음 응답',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "USER_NOT_FOUND" },
              message: { type: "string", example: "해당 이름으로 등록된 사용자가 없습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try {
    console.log("유저의 연도 타임 히스토리 정보를 요청했습니다!");
    console.log(req.get("Authorization"));
    const token = await checkFormat(req.get("Authorization"));
    console.log(token, ":test");
    if (token !== null) {
      // 토큰 이상없음
      const userInfo = await userHistoryInfoService(req.userId);
      res.send(response(status.SUCCESS, userInfo));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

// 유저가 최근에 추가한 노래 불러오기
export const handleAddRecentMusic = async (req,res,next) => {
  /*
    #swagger.summary = '유저가 최근 추가한 노래 불러오기 API';
    #swagger.tags = ['User']
    #swagger.responses[200] = {
      description: "유저가 최근에 추가한 노래 조회 성공 응답",
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
                        id: { type: "string", example: "1" },
                        title: { type: "string", example: "Love Poem" },
                        releaseTime: { type: "string", format: "date-time", example: "2021-05-05T19:46:00.000Z" },
                        image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/44953e1dc0a798c04d3fe871cebf20f6.jpg" },
                        updatedAt: { type: "string", format: "date-time", example: "2025-02-13T15:16:24.461Z" },
                        MusicArtists: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              artist: {
                                type: "object",
                                properties: {
                                  name: { type: "string", example: "IU" }
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
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "해당 유저의 음악 라이브러리를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "USER_NOT_FOUND" },
              message: { type: "string", example: "해당 유저의 음악 라이브러리를 찾을 수 없습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "토큰이 올바르지 않거나 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isSuccess: { type: "boolean", example: false },
              code: { type: "string", example: "TOKEN_FORMAT_INCORRECT" },
              message: { type: "string", example: "토큰 형식이 올바르지 않습니다." },
              result: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
*/
  try {
    console.log("유저가 최근에 추가한 노래 정보를 요청했습니다!");
    console.log(req.get("Authorization"));
    const token = await checkFormat(req.get("Authorization"));
    console.log(token, ":test");
    if (token !== null) {
      // 토큰 이상없음
      const recentMusic = await addRecentMusicService(req.userId);
      res.send(response(status.SUCCESS, recentMusic));
    } else {
      // 토큰 이상감지
      res.send(response(status.TOKEN_FORMAT_INCORRECT, null));
    }
  } catch (err) {
    console.log(err);
    res.send(response(BaseError));
  }
};

export const handleUserRecap = async (req, res, next) => {
  /*
    #swagger.summary = '유저 음악 리캡 조회 API'
    #swagger.tags = ['User']
    #swagger.responses[200] = {
      description: '유저 음악 리캡 조회 성공 응답',
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
                    title: { type: "string", example: "unlucky" },
                    image: { type: "string", example: "https://lastfm.freetls.fastly.net/i/u/300x300/ccd4b26844f8cc08d0dbff410e264533.jpg" },
                    releaseYear: { type: "number", example: 2019 },
                    artists: { type: "string", example: "IU" },
                    period: { type: "string", example: "first" }
                  }
                }
              }
            }
          },
          example: {
            isSuccess: true,
            code: "200",
            message: "success!",
            result: [
              {
                id: "1",
                title: "unlucky",
                image: "https://lastfm.freetls.fastly.net/i/u/300x300/ccd4b26844f8cc08d0dbff410e264533.jpg",
                releaseYear: 2019,
                artists: "IU",
                period: "first"
              },
              {
                id: "2",
                title: "Love Poem",
                image: "https://lastfm.freetls.fastly.net/i/u/300x300/ccd4b26844f8cc08d0dbff410e264533.jpg",
                releaseYear: 2019,
                artists: "IU",
                period: "first"
              },
              {
                id: "3",
                title: "Come Together - Remastered 2009",
                image: "https://lastfm.freetls.fastly.net/i/u/300x300/a4bbf73ba62024be279364e867b0ca20.jpg",
                releaseYear: 2022,
                artists: "The Beatles",
                period: "first"
              }
            ]
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: '서버 에러 응답',
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
    console.log("유저의 recap 정보를 요청했습니다!");
    const recapMusics = await listReacapMusics(req.userId);
    res.send(response(status.SUCCESS, recapMusics));
  } catch (err) {
    res.send(response(status.INTERNAL_SERVER_ERROR, null));
  }
};

export const handleUserPreferGenre = async (req, res, next) => {
  /*
    #swagger.summary = '유저 선호 장르 조회 API'
    #swagger.tags = ['User']
    #swagger.responses[200] = {
      description: '유저 선호 장르 조회 성공 응답',
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
                    name: { type: "string", example: "afrobeats" }
                  }
                }
              }
            }
          },
          example: {
            isSuccess: true,
            code: "200",
            message: "success!",
            result: [
              {
                id: "1",
                name: "afrobeats"
              },
              {
                id: "2",
                name: "ballad"
              },
              {
                id: "13",
                name: "rock"
              }
            ]
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: '서버 에러 응답',
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
    console.log("유저의 선호 장르를 조회합니다.");
    const userGenre = await listUserPreferGenre(req.userId);
    res.send(response(status.SUCCESS, userGenre));
  } catch (err) {
    console.log(err);
    res.send(response(status.INTERNAL_SERVER_ERROR, null));
  }
};
