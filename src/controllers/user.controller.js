import { StatusCodes } from "http-status-codes";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { 
  bodyToUser,
  checkVerificationRequestDTO
 } from "../dtos/user.dto.js";
import {
        userSignUp,
        sendVerificationCode,
        checkVerificationCode
  } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    /*
      #swagger.summary = '회원 가입 API';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                nickname: { type: "string" },
                email: { type: "string" },
                password: { type: "string"},
                profileImage: { type: "string" },
                status: { type: "string" },
                socialType: { type: "string" },
                inactiveDate: { type: "string",  format: "date"  },
                artists: {type: "array", items: { type: "number" } },
                genres: { type: "array", items: { type: "number" } }
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
                resultType: { type: "string", example: "SUCCESS" },
                error: { type: "object", nullable: true, example: null },
                success: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    nickname: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string"},
                    profileImage: { type: "string" },
                    status: { type: "string" },
                    socialType: { type: "string" },
                    inactiveDate: { type: "string",  format: "date"  },
                    artists: {type: "array", items: { type: "number" } },
                    genres: { type: "array", items: { type: "number" } }
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
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "U001" },
                    reason: { type: "string" },
                    data: { type: "object" }
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
        console.log("회원가입을 요청했습니다!");
        console.log("body:", req.body);

        const user = await userSignUp(bodyToUser(req.body));
        res.status(StatusCodes.OK).success(user);
    } catch (err) {
        return next(err);
    }
};

//이메일 인증 전송
// /users/signup/email/send-verification-code
export const sendEmail = async (req, res) => {
  /*
      #swagger.summary = '이메일 인증번호 전송 API';
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
		res.send(response(BaseError));
	}
};

// 인증번호 확인
export const checkVerification = async (req, res) => {
  /*
      #swagger.summary = '이메일 인증번호 확인 API';
      #swagger.description = '사용자가 입력한 인증번호를 서버에서 암호화된 코드와 비교하여 유효성을 확인하는 API입니다.';
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                cipherCode: { type: "string", description: "암호화된 인증 코드" },
                code: { type: "number", description: "사용자가 입력한 인증 코드", example: 123456 }
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
		res.send(response(BaseError));
	}
};