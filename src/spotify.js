import request from "request";

export const spotify = (value, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: `https://spotify23.p.rapidapi.com/${path}`,
            qs: value,
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': process.env.SPOTIFY_API_HOST
            }
        };

        request(options, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}