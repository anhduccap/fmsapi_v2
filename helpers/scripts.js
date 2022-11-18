const axios = require('axios');
const MongoClient = require("mongodb").MongoClient;
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const helper = require('./index');
const fs = require('fs-extra');

const RAPIDAPI_HOST = 'v3.football.api-sports.io';
const RAPIDAPI_KEY = '84e074563f6c08f26a87122ca9894799';

const generateUsername = (name, id) => {
    name = name.toLowerCase();
    name = helper.removeVietnameseTones(name);
    name = name.split(' ');
    let username = name.map(element => element[0])

    return username.join('') + id.toString();
}

const client = new MongoClient('mongodb+srv://anhduccap:3f00zebxa9mXgQh6@fmsapi.rilao.mongodb.net/fms_api_db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const createLeague = async () => {
    await client.connect();
    console.log("Connected correctly to server");

    const collection = client.db("fms_api_db").collection("League");
    // collection.drop();

    let data = [];

    const leagueObj = {
        id: 45,
        name: 'FA Cup',
        season: 2022,
        logo: 'https://media.api-sports.io/football/leagues/45.png',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    data.push(leagueObj);

    collection.insertMany(data);
    console.log("Database seeded! :)");
}
// createLeague();

const createMember = async (generalID) => {
    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection = client.db("fms_api_db").collection("Account");
        // collection.drop();

        const collection1 = client.db("fms_api_db").collection("Player_detail");
        // collection1.drop();

        const collection2 = client.db("fms_api_db").collection("Statistic");
        // collection2.drop();

        if(!await fs.pathExists(`./data/memberList.json`)) {
            console.log('Call external API');
            const memberListRaw = await axios({
                method: 'GET',
                url: 'https://v3.football.api-sports.io/players/squads',
                headers: {
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'x-rapidapi-key': RAPIDAPI_KEY,
                },
                params: {
                    team: 33
                },
                responseType: 'json',
            });

            if(memberListRaw.status === 200) {
                await fs.writeJson(`./data/memberList.json`, {data: JSON.stringify(memberListRaw.data.response[0].players)});
                console.log(`Saved member list file`);
            } else return;
        }

        const rawListData = await fs.readJson('./data/memberList.json');
        const memberList = JSON.parse(rawListData.data);
        console.log('Total player: ' + memberList.length);

        console.log(`ID: ${memberList[generalID-10].id}`)

        if(!await fs.pathExists(`./data/member_${memberList[generalID-10].id}.json`)) {
            console.log('Call external API');
            const memberRaw = await axios({ 
                method: 'GET',
                url: 'https://v3.football.api-sports.io/players',
                headers: {
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'x-rapidapi-key': RAPIDAPI_KEY,
                },
                params: {
                    season: 2022,
                    id: memberList[generalID-10].id,
                },
                responseType: 'json',
            });

            if(memberRaw.status === 200) {
                await fs.writeJson(`./data/member_${memberList[generalID-10].id}.json`, {data: JSON.stringify(memberRaw.data.response[0])});
                console.log(`Saved id ${memberList[generalID-10].id}`);
            } else return;
        }

        const rawPlayerData = await fs.readJson(`./data/member_${memberList[generalID-10].id}.json`);
        const playerData = JSON.parse(rawPlayerData.data);
        const player = playerData.player;
        const statistics = playerData.statistics;

        // Import to Account collection
        let data = [];
        let password = faker.random.numeric(8);
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND,10));
        const hashedPassword = await bcrypt.hash(password, salt);
                
        const dob = new Date(player.birth.date).getTime();
        const now = new Date().getTime();
        const gap = new Date(now-dob);
        const age = gap.getUTCFullYear() - 1970;
                
        let accountObj = {
            id: generalID,
            name: player.name,
            firstName: player.firstname,
            lastName: player.lastname,
            gender: 'MALE',
            phone: faker.phone.number('0#########'),
            username: generateUsername(player.name, player.id),
            password: hashedPassword,
            photo: player.photo,
            age: age,
            dob: player.birth.date,
            nationality: player.nationality,
            status: 'ACTIVE',
            type: 'PLAYER',
            detailInfo: generalID,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        data.push(accountObj);
        collection.insertMany(data);
        // console.log("Database seeded! :)");

        // Import to Player_detail collection
        let data1 = [];
        let positionObj = {
            id: generalID,
            globalID: player.id,
            height: player.height,
            weight: player.weight,
            position: memberList[generalID-10].position,
            detailPosition: [],
            kitNumber: memberList[generalID-10].number,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    
        data1.push(positionObj);
        collection1.insertMany(data1);
        // console.log("Database seeded again! :)");

        // Import to Statistic collection
        statistics.forEach(record => {
            if(record.league.id === 39 || record.league.id === 48 || record.league.id === 45 || record.league.id === 3){
                let data2 = [];
                let statObj = {
                    id: generalID,
                    player: generalID,
                    league: record.league.id,
                    appearences: record.games.appearences,
                    lineups: record.games.lineups,
                    minutes: record.games.minutes,
                    rating: record.games.rating,
                    substitutes: record.substitutes,
                    shots: record.shots,
                    goals: record.goals,
                    passes: record.passes,
                    tackles: record.tackles,
                    duels: record.duels,
                    dribbles: record.dribbles,
                    fouls: record.fouls,
                    cards: record.cards,
                    penalty: record.penalty,
                    injured: player.injured,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                data2.push(statObj);
                collection2.insertMany(data2);
                // console.log("Database seeded again final! :)");
            }
        });
        console.log("Database seeded");
        console.log(`ID: ${memberList[generalID-10].id}`)
    } catch(err) {
        console.log(err.stack);
        throw new Error(err);
    };
};

let updatePlayerStat = async () => {
    await client.connect();
    console.log("Connected correctly to server");

    const collection = client.db("fms_api_db").collection("Account");
    collection.drop();

    const collection1 = client.db("fms_api_db").collection("Player_detail");
    collection1.drop();

    const collection2 = client.db("fms_api_db").collection("Statistic");
    collection2.drop();
    for(let i = 10; i <= 45; i++) {
        await createMember(i);
    }
}
