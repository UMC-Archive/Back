import request from "request";

export const billboard = (path, date, range) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: `https://billboard-api2.p.rapidapi.com/${path}`,
            qs: {
                date: date,
                range: range
            },
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': process.env.BILLBOARD_API_HOST
            }
        };

        request(options, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
};