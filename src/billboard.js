import request from "request";

export const billboard = (path, date, range) => {
    console.log(path, date, range)
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: `https://billboard-api2.p.rapidapi.com/${path}`,
            qs: {
                date: date,
                range: range
            },
            headers: {
                'x-rapidapi-key': process.env.BILLBOARD_API_KEY,
                'x-rapidapi-host': process.env.BILLBOARD_API_HOST
            }
        };

        request(options, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            console.log(body)
            resolve(body);
        });
    });
    //example
    // return {
    //     "info": {
    //         "category": "Billboard",
    //         "chart": "HOT 100",
    //         "date": "1980-01-05",
    //         "source": "Billboard-API"
    //     },
    //     "content": {
    //         "1": {
    //             "rank": "1",
    //             "title": "Please Don't Go",
    //             "artist": "KC And The Sunshine Band",
    //             "last week": "2",
    //             "peak position": "1",
    //             "weeks on chart": "20",
    //             "detail": "up"
    //         },
    //         "2": {
    //             "rank": "2",
    //             "title": "Escape (The Pina Colada Song)",
    //             "artist": "Rupert Holmes",
    //             "last week": "1",
    //             "peak position": "1",
    //             "weeks on chart": "12",
    //             "detail": "down"
    //         },
    //         "3": {
    //             "rank": "3",
    //             "title": "Rock With You",
    //             "artist": "Michael Jackson",
    //             "last week": "11",
    //             "peak position": "3",
    //             "weeks on chart": "10",
    //             "detail": "up"
    //         },
    //         "4": {
    //             "rank": "4",
    //             "title": "Send One Your Love",
    //             "artist": "Stevie Wonder",
    //             "last week": "4",
    //             "peak position": "4",
    //             "weeks on chart": "10",
    //             "detail": "same"
    //         },
    //         "5": {
    //             "rank": "5",
    //             "title": "Do That To Me One More Time",
    //             "artist": "Captain & Tennille",
    //             "last week": "6",
    //             "peak position": "5",
    //             "weeks on chart": "12",
    //             "detail": "up"
    //         },
    //         "6": {
    //             "rank": "6",
    //             "title": "Babe",
    //             "artist": "Styx",
    //             "last week": "3",
    //             "peak position": "1",
    //             "weeks on chart": "14",
    //             "detail": "down"
    //         },
    //         "7": {
    //             "rank": "7",
    //             "title": "Still",
    //             "artist": "Commodores",
    //             "last week": "5",
    //             "peak position": "1",
    //             "weeks on chart": "15",
    //             "detail": "down"
    //         },
    //         "8": {
    //             "rank": "8",
    //             "title": "Coward Of The County",
    //             "artist": "Kenny Rogers",
    //             "last week": "22",
    //             "peak position": "8",
    //             "weeks on chart": "8",
    //             "detail": "up"
    //         },
    //         "9": {
    //             "rank": "9",
    //             "title": "Ladies Night",
    //             "artist": "Kool & The Gang",
    //             "last week": "9",
    //             "peak position": "9",
    //             "weeks on chart": "14",
    //             "detail": "same"
    //         },
    //         "10": {
    //             "rank": "10",
    //             "title": "We Don't Talk Anymore",
    //             "artist": "Cliff Richard",
    //             "last week": "13",
    //             "peak position": "10",
    //             "weeks on chart": "12",
    //             "detail": "up"
    //         }
    //     }
    // }
};