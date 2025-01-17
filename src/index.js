import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { spotifyApi } from "./auth.config.js"
import {
    handleUserSignUp,
    sendEmail,
    checkVerification,
    handleUserInfo,
    handleUserChangeImage,
    handleUserGenre,
    handleUserArtist
} from "./controllers/user.controller.js";

import {
    handleMusicNomination,
    handleAlbumNomination,
    handleMusicHidden,
    handleMusicInfo,
    handleMusicAlbumInfo,
    handleMusicArtistInfo
} from "./controllers/music.controller.js"

BigInt.prototype.toJSON = function () { return this.toString() };

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
    swaggerUiExpress.setup({}, {
        swaggerOptions: {
            url: "/openapi.json",
        },
    })
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
//spotify api 토큰
app.get('/spotify/login', (req, res) => {
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});
app.get('/spotify/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log('The access token is ' + accessToken);
        console.log('The refresh token is ' + refreshToken);

        res.send('Login successful! You can now use the /search and /play endpoints.');

        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyApi.setAccessToken(accessTokenRefreshed);
        }, expiresIn / 2 * 1000);

    }).catch(error => {
        console.error('Error getting Tokens:', error);
        res.send('Error getting tokens');
    });
});
//--------------------------------

app.get('/', (req, res, next) => {
    res.send('Hello World!')
})
//회원 가입
app.post('/users/signup', handleUserSignUp);
//이메일 인증 전송
app.get("/signup/email/send-verification-code", sendEmail);
//이메일 인증 확인
app.post("/signup/email/check-verification-code", checkVerification);


//유저 정보를 불러오는 api
app.get('/users/info/:id', handleUserInfo);
//유저 프로필 사진 변경
app.post('/users/profile_image', handleUserChangeImage);
// 유저의 장르 선택/수정 하는 api
app.post('/users/genre', handleUserGenre);
// 유저의 아티스트 선택/수정 하는 api
app.post('/users/artist', handleUserArtist);

//추천곡
app.get('/music/nomination', handleMusicNomination);
//당신을 위한 앨범 추천
app.get('/album/nomination', handleAlbumNomination);
//숨겨진 명곡
app.get('/music/hidden', handleMusicHidden);
//노래 정보 가져오기
app.get('/music/info', handleMusicInfo);
//앨범 정보 가져오기
app.get('/music/album/info', handleMusicAlbumInfo);
//아티스트 정보 가져오기
app.get('/music/artist/info', handleMusicArtistInfo);

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})