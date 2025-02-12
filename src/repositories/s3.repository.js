import { s3, upload } from "../config/s3.config.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import axios from "axios";
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
//장르 이미지 가져오는 함수
export const getGenrePngFiles = async () => {
    try {
        const folderName = 'genre'; // 폴더 이름
        const fileExtension = '.png'; // 파일 확장자

        // S3에서 'genre' 폴더의 파일 목록을 가져옵니다.
        const params = {
            Bucket: process.env.BUCKET,
            Prefix: `${folderName}/`, // 폴더 내 파일만 필터링
        };

        // S3에서 객체 목록을 가져오기
        const data = await s3.listObjectsV2(params).promise();

        // PNG 파일만 필터링
        const pngFiles = data.Contents.filter(file => file.Key.endsWith(fileExtension));

        // 파일 목록 반환
        const pngs = pngFiles.map(file => ({
            fileName: file.Key.replace(`${folderName}/`, ''),
            url: `https://${process.env.BUCKET}.s3.amazonaws.com/${file.Key}`, // S3 URL 반환
        }));
        const groups = await groupByGenre(pngs)
        return groups
    } catch (err) {
        console.error('Error fetching PNG files from S3:', err);
        throw new Error('S3에서 PNG 파일을 가져오는 중 오류 발생');
    }
};
const groupByGenre = async (files) => {
    try {
        // 장르별로 파일들을 묶을 객체 생성
        const groupedByGenre = files.reduce((acc, { fileName, url }) => {
            // 장르 이름 추출 (공백으로 분리한 후 첫 번째 부분) 후 소문자로 변환
            const genre = fileName.split('_')[0].toLowerCase();

            // 장르별로 그룹화
            if (!acc[genre]) {
                acc[genre] = [];  // 해당 장르가 없다면 새로운 배열을 초기화
            }

            // 그룹에 파일 추가
            acc[genre].push({ fileName, url });

            return acc;
        }, {});

        // 그룹화된 결과 반환
        return groupedByGenre;

    } catch (error) {
        console.error('Error grouping files by genre:', error);
        throw new Error('파일을 장르별로 그룹화하는 중 오류 발생');
    }
};

export const historyUploader = async (date, imageUrl) => {
    if (!imageUrl) {
        return null; // 이미지 URL이 없으면 null 반환
    } else {
        const folderName = 'history'; // 업로드할 폴더명
        const fileName = date; // 파일명

        try {
            // 이미지 다운로드
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            // S3 업로드 파라미터 설정
            const params = {
                Bucket: process.env.BUCKET,
                Key: `${folderName}/${fileName}`, // 폴더 경로 + 파일명
                Body: response.data, // 다운로드한 이미지 데이터
                ContentType: response.headers['content-type'], // Content-Type 자동 설정
                ACL: 'public-read' // 권한 설정
            };

            // S3에 이미지 업로드
            const s3data = await s3.upload(params).promise();

            // 업로드 후 S3 링크 반환
            const url = s3data.Location; // 업로드된 파일의 S3 URL
            return { url }; // S3 URL 반환
        } catch (err) {
            // 에러 처리
            console.error('S3 업로드 실패:', err);
            return null; // 에러 발생 시 null 반환
        }
    }
};

export const getHistoryImage = async (fileName) => {
    const params = {
        Bucket: process.env.BUCKET, // S3 버킷 이름
        Key: `history/${fileName}` // S3 파일 경로 및 이름
    };

    try {
        // headObject 메서드를 사용해 파일이 존재하는지 확인
        await s3.headObject(params).promise();
        // 파일이 존재하는 경우 URL을 반환
        const url = `https://${process.env.BUCKET}.s3.amazonaws.com/${fileName}`;
        return url;
    } catch (err) {
        return null; // 파일이 존재하지 않으면 null 반환
    }
};