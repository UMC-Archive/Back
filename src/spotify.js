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
// import request from "request";
// export const spotify = (value, path) => {
//     const options = {
//         method: 'GET',
//         url: `https://spotify23.p.rapidapi.com/${path}`,
//         qs: {
//             ids: '2w9zwq3AktTeYYMuhMjju8'
//         },
//         headers: {
//             'x-rapidapi-key': '6be23835aamshb8f71f2b096f07fp133c2djsnb99bcf1aedb2',
//             'x-rapidapi-host': 'spotify23.p.rapidapi.com'
//         }
//     };

//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);

//         console.log(body);
//     });
// }