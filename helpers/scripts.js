const request = require('request');
const axios = require('axios');

const MemberModel = require('../models/member');
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
                name: member.name,
                phone: '',
                email: '',
                role: '3',
                photo: member.photo,
            };
            axios({
                method: 'POST',
                url: 'http://localhost:3001/auth/member',
                headers: {
                    'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxN2MwYzAzOWUyY2YzY2M2ZWQ0NmNmMiIsInJvbGUiOjF9LCJleHAiOjE2MzYxMTI4NTcsImlhdCI6MTYzNjEwOTI1N30.IzziBOu1bl_mj-3wqWJXC4wnDC6ThBCUTTGHxNgNey0',
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
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxN2MwYzAzOWUyY2YzY2M2ZWQ0NmNmMiIsInJvbGUiOjF9LCJleHAiOjE2MzYxMzA2NDUsImlhdCI6MTYzNjEyNzA0NX0.3C99lfV47z4BiQSVHbqMsG-hicfzZc-wbklZF1KI4Vg'
        },
    })
    .then(response => {
        let memberList = response.data.data;
        memberList.forEach(member => {
            let season = '2021';
            axios({
                method: 'POST',
                url: `http://localhost:3001/player/statistic/${member._id}?season=${season}`,
                headers: {
                    'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im1lbWJlcl9pZCI6IjYxN2MwYzAzOWUyY2YzY2M2ZWQ0NmNmMiIsInJvbGUiOjF9LCJleHAiOjE2MzYxMzA2NDUsImlhdCI6MTYzNjEyNzA0NX0.3C99lfV47z4BiQSVHbqMsG-hicfzZc-wbklZF1KI4Vg',
                },
            })
            .then(response => console.log(response.data.messages))
            .catch(err => console.log(err));
        })
    })
    .catch(err => console.log(err));
}

// createStat();
