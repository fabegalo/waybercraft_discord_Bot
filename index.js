require('dotenv/config');

const bot = require("./app/app")

bot.initialize()

bot.execute();