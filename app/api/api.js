const fetch = require('node-fetch'); //https requests

const username = process.env.USER_BOT;
const password = process.env.USER_PASS_BOT;
const APP_URL = process.env.APP_URL;

async function getToken() {

    const body = { 'email': username, 'password': password };

    const response = await fetch(APP_URL + '/api/auth/login', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json() ?? null;
    return data['access_token'];
}

async function getPerfilApi(discordId) {

    var token = await getToken();

    const response = await fetch(APP_URL + '/api/v1/perfil/' + discordId, {
        method: 'get',
        //body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json() ?? null;

    if (response.status == 500) {
        return false
    } else {
        return data;
    }
}

async function getMinecraftForDiscordID(discordId) {

    var token = await getToken();

    const response = await fetch(APP_URL + '/api/v1/get/minecraft/name/' + discordId, {
        method: 'get',
        //body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json() ?? null;

    if (response.status == 500) {
        return false
    } else {
        return data;
    }
}

async function getCargos(cargo) {
    var token = await getToken();

    const response = await fetch(APP_URL + '/api/v1/cargo/' + cargo, {
        method: 'get',
        //body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json() ?? null;

    //console.log(data);

    if (response.status == 500) {
        return false
    } else {
        return data;
    }
}

async function getLogs(discordId, channel) {

    var token = await getToken();

    var typeLog = channel.name

    //console.log(typeLog);

    const response = await fetch(APP_URL + '/api/v1/logs/' + discordId + "/" + typeLog, {
        method: 'get',
        //body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json() ?? null;

    //console.log(data);

    if (response.status == 500) {
        return false
    } else {
        return data;
    }
}

async function setBooster(discordId, status) {
    var token = await getToken();

    const body = { 'discordId': discordId, 'status': status };

    const response = await fetch(APP_URL + '/api/v1/booster', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json() ?? null;

    if (response.status == 200) {
        return true;
    }

    if (response.status == 500) {
        return false
    } else {
        return data;
    }
}

module.exports = { getPerfilApi, getLogs, getCargos, setBooster };