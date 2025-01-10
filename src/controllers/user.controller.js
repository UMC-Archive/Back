import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

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