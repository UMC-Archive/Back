import { s3, upload } from "../config/s3.config.js";

// 프로필 이미지 업로드를 처리하는 함수
export const profileUploader = async (req, res) => {
    return new Promise((resolve, reject) => {
        upload.single('image')(req, res, async (err) => {
            if (!req.file) {
                return reject(new Error('파일 업로드 실패'));
            }

            const folderName = 'archive'; // 업로드할 폴더명
            const fileName = Date.now() + '-' + req.file.originalname; // 파일명

            const params = {
                Bucket: process.env.BUCKET,
                Key: `${folderName}/${fileName}`, // 폴더 경로 + 파일명
                Body: req.file.buffer,
                ACL: 'public-read' // 권한 설정
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    return reject(new Error('S3 업로드 실패'));
                }

                // 업로드 후 S3 링크 반환
                const fileUrl = data.Location; // 업로드된 파일의 S3 URL
                resolve(fileUrl); // Promise를 통해 반환
            });
        })
    });
};