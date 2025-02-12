import { StatusCodes } from "http-status-codes";

export const status = {
  // success
  SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: "200",
    message: "success!",
  },

  // error
  // common err
  INTERNAL_SERVER_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    isSuccess: false,
    code: "COMMON000",
    message: "서버 에러, 관리자에게 문의 바랍니다.",
  },
  BAD_REQUEST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON001",
    message: "잘못된 요청입니다.",
  },
  UNAUTHORIZED: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "COMMON002",
    message: "권한이 잘못되었습니다.",
  },
  METHOD_NOT_ALLOWED: {
    status: StatusCodes.METHOD_NOT_ALLOWED,
    isSuccess: false,
    code: "COMMON003",
    message: "지원하지 않는 Http Method 입니다.",
  },
  FORBIDDEN: {
    status: StatusCodes.FORBIDDEN,
    isSuccess: false,
    code: "COMMON004",
    message: "금지된 요청입니다.",
  },
  NOT_FOUND: {
    status: StatusCodes.NOT_FOUND,
    isSuccess: false,
    code: "COMMON005",
    message: "요청한 페이지를 찾을 수 없습니다. 관리자에게 문의 바랍니다.",
  },
  AUTH_ERROR: {
    status: StatusCodes.AUTH_ERROR,
    isSuccess: false,
    code: "COMMON006",
    message: "인증번호가 잘못되었습니다. 다시 확인해 주세요.",
  },

  // member err
  MEMBER_NOT_FOUND: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4001",
    message: "사용자가 없습니다.",
  },
  NICKNAME_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4002",
    message: "닉네임은 필수입니다.",
  },
  EMAIL_ALREADY_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4003",
    message: "이미 가입된 이메일이 존재합니다.",
  },

  TOKEN_FORMAT_INCORRECT: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4006",
    message: "토큰의 형식이 올바르지 않습니다. 다시 확인해주세요.",
  },
  FILE_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4004",
    message: "파일이 존재하지 않습니다.",
  },

  // db error
  PARAMETER_IS_WRONG: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "DATABASE4001",
    message:
      "쿼리 실행 시 전달되는 파라미터가 잘못되었습니다. 파라미터 개수 혹은 파라미터 형식을 확인해주세요.",
  },

  // login err
  LOGIN_PARAM_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "SIGNIN4001",
    message: "ID 혹은 PW 값이 존재하지 않습니다.",
  },
  LOGIN_ID_NOT_EXIST: {
    status: StatusCodes.NOT_FOUND,
    isSuccess: false,
    code: "SIGNIN4002",
    message: "아이디를 찾을 수 없습니다.",
  },
  LOGIN_PASSWORD_WRONG: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "SIGNIN4003",
    message: "비밀번호가 일치하지 않습니다.",
  },
  TOKEN_IS_EXPIRED: {
    status: StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE,
    isSuccess: false,
    code: "SIGNIN4004",
    message: "토큰이 만료되었습니다.",
  },
  TOKEN_IS_INVALID: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "SIGNIN4005",
    message: "유효하지 않은 토큰입니다.",
  },

  //music err
  MUSIC_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC4001",
    message: "음악이 존재하지 않습니다.",
  },
  ALBUM_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC4002",
    message: "앨범이 존재하지 않습니다.",
  },
  ARTIST_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC4003",
    message: "아티스트가 존재하지 않습니다.",
  },
  ALL_VALUE_NOT_EXIST: {
    status: StatusCodes.NOT_FOUND,
    isSuccess: false,
    code: "MUSIC4004",
    message: "요청하신 값이 모두 존재하지 않습니다.",
  },
  ALL_NAME_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC4005",
    message: "요청하신 이름이 모두 존재하지 않습니다.",
  },
  //AWS err
  IMAGE_NOT_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "AWS4001",
    message: "이미지 파일이 존재하지 않습니다.",
  },
  MUSIC_IS_EXIST:{
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC004",
    message: "보관함에 음악이 이미 존재합니다.",
  },
  ALBUM_IS_EXIST:{
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC005",
    message: "보관함에 앨범이 이미 존재합니다.",
  },
  ARTIST_IS_EXIST:{
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC006",
    message: "보관함에 아티스트가 이미 존재합니다.",
  },
  MUSIC_NOT_LIBRARY:{
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC007",
    message: "보관함에 해당 노래가 존재하지 않습니다.",
  },
  ALBUM_NOT_LIBRARY:{
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC008",
    message: "보관함에 해당 앨범이 존재하지 않습니다.",
  },
  ARTIST_NOT_LIBRARY:{
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MUSIC009",
    message: "보관함에 해당 아티스트가 존재하지 않습니다.",
  }
};
