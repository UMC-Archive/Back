import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, userInfoService} from "../services/user.service.js";

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

export const handleUserInfo = async (req, res, next) => {
  /*
  #swagger.summary = '유저 정보 조회 API';
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
            createdAt : { type: "string", format: "date", example: "2025-01-01" },
            updatedAt : { type: "string", format: "date", example: "2025-01-01" }
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
  try{
    console.log("유저 정보를 불러옵니다.");
    //토큰 사용전 임의로 사용
    const userId = req.params.id;
    const userInfo = await userInfoService(userId);
    res.status(StatusCodes.OK).success(userInfo);
  } catch (err){
    return next(err);
  }
}