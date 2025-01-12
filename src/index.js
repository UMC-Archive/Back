import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

import { 
    handleUserSignUp,
    sendEmail,
    checkVerification,
    handleUserInfo,
    handleUserChangeImage
 } from "./controllers/user.controller.js";

BigInt.prototype.toJSON = function () { return this.toString() };

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: '*' }));
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
    const doc = {
        info: {
            title: "UMC 7th",
            description: "UMC 7th Node.js 테스트 프로젝트입니다.",
        },
        host: "localhost:3000",
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

app.get('/', (req, res, next) => {
    res.send('Hello World!')
})
app.post('/users/signup', handleUserSignUp);
//이메일 인증 전송
app.get("/signup/email/send-verification-code", sendEmail);
//이메일 인증 확인
app.post("/signup/email/check-verification-code", checkVerification);


//유저 정보를 불러오는 api
app.get('/users/info', handleUserInfo);
//유저 프로필 사진 변경
app.post('/users/profile_image', handleUserChangeImage);
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