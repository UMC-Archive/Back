import { StatusCodes } from "http-status-codes";
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
	try {
		let encryptedCode = await sendVerificationCode(req.param("email"));

		if (encryptedCode !== null) {
			// if email doesn't exists
			console.log(encryptedCode);

			res.send(response(status.SUCCESS, encryptedCode));
		} else {
			// if email exists
			res.send(response(status.EMAIL_ALREADY_EXIST, null));
		}
	} catch (err) {
		console.log(err);
		res.send(response(BaseError));
	}
};

// 인증번호 확인
export const checkVerification = async (req, res) => {
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