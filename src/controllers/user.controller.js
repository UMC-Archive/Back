import { StatusCodes } from "http-status-codes";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
  bodyToUser,
  loginRequestDTO,
  bodyToImageDTO,
  checkVerificationRequestDTO,
  bodyToGenreDTO,
  bodyToArtistDTO,
  bodyToUserMusic,
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
} from "../services/user.service.js";

//회원가입
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              nickname: { type: "string", example: "닉네임" },
              email: { type: "string", example: "example@email.com"},
              password: { type: "string", example: "password"},
              status: { type: "string", example: "active"},
              socialType: { type: "string", example: "example"},
              inactiveDate: { type: "string",  format: "date"  },
              artists: {type: "array", items: { type: "number", example: 1} },
              genres: { type: "array", items: { type: "number",example: 1} }
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
                      email: { type: "string", example: "example@gmail.com"},
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
    if (user) {
      res.send(response(status.SUCCESS, user));
    }
    else {
      res.send(response(status.EMAIL_ALREADY_EXIST, null));
    }
  } catch (err) {
    res.send(response(status.EMAIL_ALREADY_EXIST, null));
  }
};

// 로그인
export const handleLogin = async (req, res, next) => {
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
    return next(err);
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
export const handleUserInfo = async (req, res, next) => {
  /*
  #swagger.summary = '유저 정보 조회 API';
  #swagger.tags = ['User']
  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    description: '조회할 유저의 고유 ID',
    schema: { type: 'string', example: '12345' }
  };
  #swagger.responses[200] = {
    description: "유저 정보 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", example: "12345" },
            name: { type: "string", example: "John Doe" },
            nickname: { type: "string", example: "johnd" },
            email: { type: "string", example: "john.doe@example.com" },
            profileImage: { type: "string", example: "https://example.com/profile.jpg" },
            status: { type: "string", example: "active" },
            socialType: { type: "string", example: "google" },
            inactiveDate: { type: "string", format: "date", example: "2025-01-01" },
            createdAt : { type: "string", format: "date", example: "2025-01-12T04:43:36.811Z" },
            updatedAt : { type: "string", format: "date", example: "2025-01-12T10:26:40.610Z" }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "유저 정보를 찾을 수 없음",
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
                reason: { type: "string", example: "유저를 찾을 수 없습니다." },
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
  try {
    console.log("유저 정보를 불러옵니다.");
    //토큰 사용전 임의로 사용
    const userId = req.params.id;
    console.log(userId);
    const userInfo = await userInfoService(userId);
    res.send(response(status.SUCCESS, userInfo));
  } catch (err) {
    return next(err);
  }
}

// 유저 프로필 이미지 변경
export const handleUserChangeImage = async (req, res, next) => {
  /*
  #swagger.summary = '유저 프로필 이미지 변경 API';
  #swagger.tags = ['User']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            profileImage: { type: "string", example: "https://example.com/new-profile.jpg" }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "유저 프로필 이미지 변경 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", example: "12345" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            profileImage: { type: "string", example: "https://example.com/new-profile.jpg" },
            updatedAt: { type: "string", format: "date-time", example: "2025-01-12T14:32:00Z" }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "해당 이름과 이메일로 사용자를 찾을 수 없음",
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
                reason: { type: "string", example: "해당 이름과 이메일로 등록된 사용자가 없습니다." },
                data: { type: "object", example: {} }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청 파라미터 오류",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U400" },
                reason: { type: "string", example: "요청 파라미터를 확인해주세요." },
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
  try {
    console.log("유저의 프로필 이미지 변경을 요청했습니다!");
    console.log("bodyController:", req.body);
    const changeImage = await userChangeImageService(req, res, bodyToImageDTO(req.body));
    res.send(response(status.SUCCESS, changeImage));
  } catch (err) {
    return next(err);
  }
};

// 유저의 장르 선택/수정
export const handleUserGenre = async (req, res, next) => {
  /*
  #swagger.summary = '유저의 장르 선택/수정 API';
  #swagger.tags = ['User']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            genreId: { type: "integer", example: 3 }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "유저 장르 선택/수정 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", example: "12345" },
            userId: { type: "string", example: "67890" },
            genreId: { type: "integer", example: 3 },
            updatedAt: { type: "string", format: "date-time", example: "2025-01-12T15:45:00Z" }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "해당 이름과 이메일 또는 장르 정보를 찾을 수 없음",
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
                reason: { type: "string", example: "해당 이름과 이메일로 등록된 사용자가 없습니다." },
                data: { type: "object", example: {} }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청 파라미터 오류",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U400" },
                reason: { type: "string", example: "요청 파라미터를 확인해주세요." },
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
  try {
    console.log("유저가 장르 변경을 요청했습니다!");
    console.log("bodyController:", req.body);
    const changeGenre = await userChangeGenreService(bodyToGenreDTO(req.body));
    res.send(response(status.SUCCESS, changeGenre));
  } catch (err) {
    return next(err);
  }
};

// 유저의 아티스트 선택/수정
export const handleUserArtist = async (req, res, next) => {
  /*
  #swagger.summary = '유저의 아티스트 선택/수정 API';
  #swagger.tags = ['User']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            artistId: { type: "integer", example: 5 }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "유저 아티스트 선택/수정 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", example: "67890" },
            userId: { type: "string", example: "12345" },
            artistId: { type: "integer", example: 5 },
            updatedAt: { type: "string", format: "date-time", example: "2025-01-12T15:45:00Z" }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "해당 이름과 이메일 또는 아티스트 정보를 찾을 수 없음",
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
                reason: { type: "string", example: "해당 이름과 이메일로 등록된 사용자가 없습니다." },
                data: { type: "object", example: {} }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "요청 파라미터 오류",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U400" },
                reason: { type: "string", example: "요청 파라미터를 확인해주세요." },
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
  try {
    console.log("유저가 아티스트 변경을 요청했습니다!");
    console.log("bodyController:", req.body);
    const changeArtist = await userChangeArtistService(bodyToArtistDTO(req.body));
    res.send(response(status.SUCCESS, changeArtist));
  } catch (err) {
    return next(err);
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
    }
    else {
      res.send(response(status.FILE_NOT_EXIST, null));
    }
  } catch (err) {
    res.send(response(status.FILE_NOT_EXIST, null));
  }
}

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
              userId: { type: "number", example: 1 },
              musicId: {type: "number", example: 1 },
            }
          }
        }
      }
    };
  */
  try {
    console.log("유저의 음악 재생 시 기록하기를 요청했습니다!");
    const userMusic = await userPlay(bodyToUserMusic(req.body))

    res.send(response(status.SUCCESS, userMusic));
  } catch (err) {
    res.send(response(status.BAD_REQUEST, null));
  }
};
