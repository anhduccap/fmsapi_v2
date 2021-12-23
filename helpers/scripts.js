const request = require('request');
const axios = require('axios');

const StatModel = require('../models/stat');

let createMember = async () => {
    let options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/players/squads',
        qs: {team: '33'},
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': '39ca433ef98ac8cb40a89b37f1111714'
        }
    };

    await request(options, (err, response, body) => {
        if (err) throw new Error(err);

        const obj = JSON.parse(body);

        const memberList = obj.response[0].players;

        memberList.forEach(async (member) => {
            let data = {
                id: member.id,
                position: member.position,
                kit_number: member.number,
                name: member.name,
                role: '3',
                photo: member.photo,
            };
            axios({
                method: 'POST',
                url: 'http://localhost:3001/auth/member',
                headers: {
                    'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxYWYyZTVkOWZjMmVhNDc3Mzg4YjBhNyIsInJvbGUiOjF9LCJleHAiOjE2Mzg4OTMwODgsImlhdCI6MTYzODg4OTQ4OH0.HcWRkvncfxsu-n9u9aFLXYAgmFOHGAmZn3tXkFETUhI',
                },
                data: data,
            })
            .then(response => console.log('Complete 1 member...'))
            .catch(err => console.log(err));
        });
    });
}

// createMember();

let createStat = async () => {

    axios({
        method: 'GET',
        url: 'http://localhost:3001/player',
        headers: {
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxYWYyZTVkOWZjMmVhNDc3Mzg4YjBhNyIsInJvbGUiOjF9LCJleHAiOjE2Mzg4OTMwODgsImlhdCI6MTYzODg4OTQ4OH0.HcWRkvncfxsu-n9u9aFLXYAgmFOHGAmZn3tXkFETUhI'
        },
    })
    .then(response => {
        let memberList = response.data.data;
        // console.log(memberList);
        memberList.forEach(member => {
            let season = '2021';
            axios({
                method: 'POST',
                url: `http://localhost:3001/player/${member._id}/statistic?season=${season}`,
                headers: {
                    'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxYWYyZTVkOWZjMmVhNDc3Mzg4YjBhNyIsInJvbGUiOjF9LCJleHAiOjE2Mzg4OTMwODgsImlhdCI6MTYzODg4OTQ4OH0.HcWRkvncfxsu-n9u9aFLXYAgmFOHGAmZn3tXkFETUhI',
                },
            })
            .then(response => console.log(response.data.message))
            .catch(err => console.log(err.message));
        })
    })
    .catch(err => console.log(err.messages));
}

// createStat();

let update = (stat) => {
    axios({
        method: 'GET',
        url: 'https://v3.football.api-sports.io/players',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': '39ca433ef98ac8cb40a89b37f1111714',
        },
        params: {
            id: stat.player.id,
            season: stat.season
        }
    })
    .then( response => response.data.response[0])
    .then( response => {
        axios({
            method: 'POST',
            url: `http://localhost:3001/coach/update_rating`,
            params: {
                stat_id: stat._id,
            },
            headers: {
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxYWYyZTVkOWZjMmVhNDc3Mzg4YjBhNyIsInJvbGUiOjF9LCJleHAiOjE2NDAyNTg4NDcsImlhdCI6MTY0MDI1NTI0N30.E-x1nczHS1-WZsGi0XCibuRPxNoSOeHuEjjkbGCmyck'
            },
            data: {
                rating: response.statistics[0].games.rating
            }
        })
        .then (response => console.log(`Updating complete`))
        .catch(err => console.log(err.message));
    })
    .catch(err => {
        console.log(err.message);
    });
}


let updateRating = async () => {
    axios({
        method: 'GET',
        url: `http://localhost:3001/coach/statistic`,
        headers: {
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxYWYyZTVkOWZjMmVhNDc3Mzg4YjBhNyIsInJvbGUiOjF9LCJleHAiOjE2NDAyNTg4NDcsImlhdCI6MTY0MDI1NTI0N30.E-x1nczHS1-WZsGi0XCibuRPxNoSOeHuEjjkbGCmyck'
        }
    })
    .then( response => response.data.data)
    .then( response => {
        let numberOfStat = response.length;
        let count = 0;
        let updateProcess = setInterval(() => {
            update(response[count]);
            if(count === numberOfStat - 1) {
                clearInterval(updateProcess);
            }
            else{
                count++;
            }
        }, 6000);


        update(response[0]);
    })
    .catch( err => console.log(err.message));
}

updateRating();
