import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const createJwt = (req) => {
	const token = jwt.sign({ req }, process.env.JWT_SECRET, {
		expiresIn: "4h", // 4시간(임시임)
	});
	return token;
};