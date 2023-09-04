const TelegramApi = require('node-telegram-bot-api')
const token = '6425164988:AAGsm2DMC0iQIv7yKn2CLuTdl5gka88bqus'
const {gameOptions, againOptions} = require('./options')
const bot = new TelegramApi(token, {polling:true})
const chats = {};

const startGame = async(chatId) => {
    await bot.sendMessage(chatId, `Угадай цифру от 0 до 9`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command:'/start', description:'Приветствие'},
        {command:'/info', description:'Информация о пользователе'},
        {command:'/game', description:'Игра'},
    ])
        
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/869/281/86928106-6812-340c-9d51-70ef0f8a4771/6.webp');
            return bot.sendMessage(chatId, `Привет я Бот`);
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, твой никнэйм @${msg.from.username}`);
        }
        if(text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!)')
    })

    bot.on('callback_query',async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Отгадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Я загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start();