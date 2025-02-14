import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { verify } from "../src/middleware/jwt.js";
import {
  handleUserSignUp,
  handleLogin,
  sendEmail,
  checkVerification,
  handleUserInfo,
  handleUserChangeImage,
  handleUserGenre,
  handleUserArtist,
  handleUserProfile,
  handleUserPlay,
  handleHistory,
  handleGetHistory,
  handleAddRecentMusic,
  handleUserRecap,
  handleUserPreferGenre,
} from "./controllers/user.controller.js";
import {
  handleMusicNomination,
  handleAlbumNomination,
  handleMusicHidden,
  handleMusicInfo,
  handleMusicAlbumInfo,
  handleMusicArtistInfo,
  handleMusicGenreInfo,
  handleArtistsInfo,
  handleCommonMusicNomination,
  handleAlbumCuration,
  handleArtistCuration,
  handleGenreImage,
  handleCommonAlbumNomination,
  handleAlbumTrackList,
  handleArtistSimilar,
  handleDifferentAlbum,
  handleAllInfo,
  handleMusicSelection,
} from "./controllers/music.controller.js";
import {
  handleLibraryMusic,
  handleLibraryArtist,
  handleLibraryAlbum,
  addMusicLibrary,
  addAllbumLibrary,
  addArtistLibrary,
  deleteMusicLibrary,
  deleteAlbumLibrary,
  deleteArtistLibrary
} from "./controllers/library.controller.js";

import fs from "fs";
import path from "path";
import HTTPS from "https";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null";
  const routes = ["./src/index.js"];
  const protocol = req.protocol; // http 또는 https
  const host = req.get("host");
  const doc = {
    info: {
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트입니다.",
    },
    host: `${protocol}://${host}`,
    components: {
      securitySchemes: {
        Bearer: {
          type: "apiKey",
          in: "header",
          name: "Authorization", // Authorization 헤더로 전달
          description: "Bearer token을 사용한 인증",
        },
      },
    },
    security: [
      {
        Bearer: [], // 기본적으로 Bearer 인증을 적용
      },
    ],
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next();
});
//--------------------------------
app.get("/", (req, res, next) => {
  // #swagger.ignore = true
  res.send("Hello World!");
});

app.use(verify);
//회원 가입
app.post("/users/signup", handleUserSignUp);
//로그인
app.post("/users/login", handleLogin);
//이메일 인증 전송
app.get("/users/signup/email/send-verification-code", sendEmail);
//이메일 인증 확인
app.post("/users/signup/email/check-verification-code", checkVerification);

// 장르 정보 조회
app.get("/music/genre/info", handleGenreImage);
// 아티스트 정보 조회
app.get("/music/artist/info", handleArtistsInfo);

//유저 정보를 불러오는 api
app.get("/users/info", handleUserInfo);
//유저 프로필 사진 변경
app.post("/users/profile_image", handleUserChangeImage);
// 유저의 장르 선택/수정 하는 api
app.post("/users/genre", handleUserGenre);
// 유저의 아티스트 선택/수정 하는 api
app.post("/users/artist", handleUserArtist);
// 유저의 사진을 업로드 하는 api
//app.post("/users/profile", handleUserProfile); // 회원가입이랑 통합으로 미사용
// 유저의 음악 재생 시 기록하기
app.post("/users/play", handleUserPlay);
//유저 time 히스토리 추가하는 api
app.post("/users/history", handleHistory);
//유저 time 히스토리 불러오는 api
app.get("/users/history", handleGetHistory);
//유저가 최근 추가한 노래 api
app.get("/users/recent", handleAddRecentMusic);
//recap 결산
app.get("/users/recap", handleUserRecap);
//장르 취향 반환
app.get("/users/genre/preference", handleUserPreferGenre);

//추천곡(연도)
app.get("/music/year/nomination", handleMusicNomination);
//당신을 위한 앨범 추천(연도)
app.get("/album/year/nomination", handleAlbumNomination);
//추천곡(일반)
app.get("/music/nomination", handleCommonMusicNomination);
//당신을 위한 앨범 추천(일반)
app.get("/album/nomination", handleCommonAlbumNomination);
//숨겨진 명곡
app.get("/music/hidden", handleMusicHidden);
//노래 정보 가져오기
app.post("/music", handleMusicInfo);
//앨범 정보 가져오기
app.post("/music/album", handleMusicAlbumInfo);
//아티스트 정보 가져오기
app.post("/music/artist", handleMusicArtistInfo);
//앨범 큐레이션
app.post("/music/album/:album_id/curation", handleAlbumCuration);
//아티스트 큐레이션
app.post("/music/artist/:artist_id/curation", handleArtistCuration);
//빠른 선곡
app.get("/music/selection", handleMusicSelection);

//보관함 노래 조회
app.get("/library/music", handleLibraryMusic);
//보관함 아티스트 조회
app.get("/library/artist", handleLibraryArtist);
//보관함 앨범 조회
app.get("/library/album", handleLibraryAlbum);
//보관함 노래 추가
app.post("/library/music/:musicId", addMusicLibrary);
//보관함 앨범 추가
app.post("/library/album/:albumId", addAllbumLibrary);
//보관함 아티스트 추가
app.post("/library/artist/:artistId", addArtistLibrary);
//보관함 노래 삭제
app.delete("/library/music/:musicId", deleteMusicLibrary);
//보관함 앨범 삭제
app.delete("/library/album/:albumId", deleteAlbumLibrary);
//보관함 아티스트트 삭제
app.delete("/library/artist/:artistId", deleteArtistLibrary);
//수록곡 조회
app.get("/album/:album_id/track-list", handleAlbumTrackList);
//이 아티스트와 비슷한 아티스트
app.get("/music/artist/:artist_id/similar", handleArtistSimilar);
//이 아티스트의 다른 앨범
app.get("/music/artist/:artist_id/album/:album_id", handleDifferentAlbum);
//정보 가져오기
app.get("/music/all/info", handleAllInfo);
//--------------------------------

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// const option = {
//     ca: fs.readFileSync('./pem/fullchain.pem'),
//     key: fs.readFileSync(path.resolve(process.cwd(), './pem/privkey.pem'), 'utf8').toString(),
//     cert: fs.readFileSync(path.resolve(process.cwd(), './pem/cert.pem'), 'utf8').toString(),
// };

// HTTPS.createServer(option, app).listen(port, () => {
//     console.log(`[HTTPS] Server is runnig on port ${port}`);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
