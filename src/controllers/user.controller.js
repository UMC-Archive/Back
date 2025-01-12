import { StatusCodes } from "http-status-codes";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { bodyToUser ,bodyToUserLogin} from "../dtos/user.dto.js";
import { userSignUp ,userLogin} from "../services/user.service.js";

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

// 로그인 api
export const handleUserLogin = async (req, res, next) => {
  try {
    console.log("로그인을 요청했습니다!");
    console.log("body:", req.body);
    const result = await userLogin(bodyToUserLogin(req.body));
    if (result === 1) {
			// 이메일[ID]이 존재 하지 않는 경우
			res.send(response(status.LOGIN_EMAIL_NOT_EXIST, null));
		} else if (result === 2) {
			// 패스워드가 잘못 된 경우
			res.send(response(status.LOGIN_PASSWORD_WRONG, null));
		} else {
			// 로그인 성공
			res.send(response(status.SUCCESS, result));
		}
  } catch (err) {
      console.log(err);
		  res.send(response(BaseError));
  }
};