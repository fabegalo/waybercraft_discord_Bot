const fetch = require('node-fetch'); //https requests

var { USER_BOT, USER_PASS_BOT, APP_URL } = require('../config.json');

const username = USER_BOT;
const password = USER_PASS_BOT;

async function getToken() {

    const body = {'email': username, 'password': password};

    const response = await fetch(APP_URL+'/api/auth/login', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
    
    const data = await response.json() ?? null;
    return data['access_token'];
}

async function getPerfilApi(discordId) {

    var token = await getToken();

    const response = await fetch(APP_URL+'/api/v1/perfil/'+discordId, {
        method: 'get',
        //body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+token}
    });

    const data = await response.json() ?? null;

    if(response.status == 500){
        return false
    }else {
        return data;
    }
}

async function getMinecraftForDiscordID(discordId) {

    var token = await getToken();

    const response = await fetch(APP_URL+'/api/v1/get/minecraft/name/'+discordId, {
        method: 'get',
        //body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+token}
    });

    const data = await response.json() ?? null;

    if(response.status == 500){
        return false
    }else {
        return data;
    }
}

module.exports = { getPerfilApi };