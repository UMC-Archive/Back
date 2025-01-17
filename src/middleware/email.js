import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 메일발송 객체
const mailSender = {
	// 메일발송 함수 (보낸사람의 대표 이름, 받는주소, 제목, html문서)
	sendGmail: (toEmail, code) => {
		var transporter = nodemailer.createTransport({
			service: "gmail", // 메일 보내는 곳
			prot: 587, //gmail 의 경우 587을 사용함
			host: "smtp.gmail.com",
			secure: false,
			requireTLS: true,
			auth: {
				user: process.env.AUTH_EMAIL, // 보내는 메일의 주소
				pass: process.env.AUTH_PASSWORD, // 보내는 메일의 비밀번호
			}
			// ,
			// tls : {
			// 	rejectUnauthorized : false
			// }
		});

		// 메일 옵션
		var mailOptions = {
			from: "Archive" + " <" + process.env.AUTH_EMAIL + ">", // 보낸사람의 메일주소 및 이름
			to: toEmail, // 수신할 이메일
			subject: "[Archive] 회원가입 인증 메일입니다.", // 메일 제목
			//text: text // 메일 내용
			html: `<h2> Archive 회원가입 이메일 인증 코드입니다.</h2></br><h3>${code}</h3></br><h3>감사합니다.</h3>`, //html형식의 메일 내용
		};

		console.log("mailSender called");

		// 메일 발송
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
	},
};
export default mailSender;
// module.exports = mailSender;