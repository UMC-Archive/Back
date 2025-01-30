import { s3, upload } from "../config/s3.config.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
// 프로필 이미지 업로드를 처리하는 함수
export const profileUploader = async (req, res) => {
    return new Promise((resolve, reject) => {
        upload.fields([{ name: 'image' }, { name: 'data' }])(req, res, async (err) => {
            if (!req.files || !req.files.image) {
                reject(res.send(response(status.IMAGE_NOT_EXIST, null)))
            }
            else {
                const data = req.body.data;
                const folderName = 'archive'; // 업로드할 폴더명
                const fileName = Date.now() + '-' + req.files.image[0].originalname; // 파일명

                const params = {
                    Bucket: process.env.BUCKET,
                    Key: `${folderName}/${fileName}`, // 폴더 경로 + 파일명
                    Body: req.files.image[0].buffer,
                    ACL: 'public-read' // 권한 설정
                };

                s3.upload(params, (err, s3data) => {
                    if (err) {
                        return reject(new Error('S3 업로드 실패'));
                    }

                    // 업로드 후 S3 링크 반환
                    const url = s3data.Location; // 업로드된 파일의 S3 URL
                    resolve({ url, data }); // Promise를 통해 반환
                });
            }
        })
    });
};