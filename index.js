const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require('axios').default;
const { CronJob } = require('cron');

const User = require('./models/user.models');
const { linkedinPost } = require('./gpt');

//  Configurar el fichero de entorno .env
require('dotenv').config();

//  Configuración de la base de datos
require('./db');

//  Creamos app de Express
const app = express();

//  Crear el bot de Telegram
const bot = new Telegraf(process.env.BOT_TOKEN);

//  Confihurar la conexión con Telegram
app.use(bot.webhookCallback('/telegram-bot'));
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`);

app.post('/telegram-bot', (req, res) => {
    res.send('Responde');
});

//  MIDDLEWARE
bot.use(async (ctx, next) => {
    const user = await User.findOne({ telegram_id: ctx.from.id })
    if (!user) {
        ctx.from.telegram_id = ctx.from.id;
        await User.create(ctx.from);
    }
    next();
})

//  Comandos del bot
bot.command('test', async ctx => {
    await ctx.reply('Funsiona!!');
    await ctx.replyWithDice();
    ctx.replyWithMarkdownV2('*Negrita* _cursiva_')
})

//  Comandos para la previsión del tiempo
bot.command('tiempo', async ctx => {
    //  const ciudad2 = await ctx.message.text.split('/tiempo')[1]; //  Opción 2
    const ciudad = ctx.message.text.slice(8);
    //  https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OWM_API_KEY}&units=metric`);
        await ctx.replyWithHTML(`<b>Tiempo en ${ciudad.toUpperCase()}</b>
        Temperatura ${data.main.temp}ºC
        Mínima ${data.main.temp_min}ºC
        Máxima ${data.main.temp_max}ºC
        Humedad ${data.main.humidity}%
        `)
        await ctx.replyWithLocation(data.coord.lat, data.coord.lon)
    } catch (error) {
        ctx.reply(`No tenemos datos para la ciudad ${ciudad}`)
    }
});

bot.command('mensaje', async ctx => {
    //  mensaje Hola amigui
    const mensaje = ctx.message.text.split('/mensaje')[1];

    const users = await User.find();
    const user = users[Math.floor(Math.random() * users.length)]; // Movidas tochas para seleccionar un usuario aleatoro
    try {
        await bot.telegram.sendMessage(user.telegram_id, `# ${mensaje}`);
        await ctx.reply(`Mensaje enviado a ${user.username}`);
    } catch (error) {
        ctx.reply('Usa bien el comando /mensaje');
    }
})


bot.command('linkedin', async ctx => {
    //  /linkedin como usar javascript en el servidor
    const idea = ctx.message.text.split('/linkedin')[1];

    ctx.reply('Déjame que piense...')

    const response = await linkedinPost(idea);
    ctx.reply(response);
})

//  Ponemos a escuchar en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
})

// CRON
/* const job = new CronJob(
    '0 0 0 0 * *', // cronTime
    async function () {
        const users = await User.find();
        const user = users[Math.floor(Math.random() * users.length)];

        try {
            await bot.telegram.sendMessage(user.telegram_id, '¡Qué tengas un día estupendísimo!');
            console.log(`Enviado a ${user.first_name}`);
        } catch (error) {
            console.log('Usa bien el comando 🤡')
        }
    }, // onTick
    null, // onComplete
    false, // start
    'Europe/Madrid' // timeZone
);

job.start(); */