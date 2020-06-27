const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();
const bot = new TelegramBot(process.env.BOT_KEY, {polling: true});

function process_message_test_encrytion(msg){
    if(msg.text.length === 4096){

        let message = {
            name: msg.from.first_name,
            username: msg.from.username,
            user_id: msg.from.id,
            chat_title: msg.chat.title,
            chat_id: msg.chat.id,
            date:msg.date,
            text:"error decrypting :("
        };

        axios.post(process.env.API+'/decrypt', {
            text: msg.text
        })
            .then(function (response) {
                message.text = response.data.text.toString()
            })
            .catch(function (error) {
                console.log(error);
            }).finally(function () {
                let date = new Date(message.date * 1000);
                let date_pretty = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getFullYear() + "-" + date.getUTCMonth() + "-" + date.getUTCDay();
                console.log("From:", message.name, "\ntime: ", date_pretty,
                    "\nchat: ", message.chat_title, "\ntext:", message.text, "\n\n");
            })
    }else {
        console.log("too short");
    }
}

bot.on('message', (msg) => {
    if(msg.text){
        process_message_test_encrytion(msg);
    }
});

bot.on('polling_error', (error) => {
    if( error.code ){
        if(error.code !== 'EFATAL'){
            console.log("error code: ", error);
        }
    }else{
        console.log("error code: ", error);
    }
});