const { fazerRequisicaoChat } = require('./ias.js');
const qrcode = require('qrcode-terminal');
 
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {


	console.log(message.from.replace(/@c\.us$/, '')+": "+ message.body);

    fazerRequisicaoChat(message.body)
    .then(resultado => {
        message.reply(resultado.openai.generated_text)
    })
    .catch(erro => {
        
    });

});
 

client.initialize();
 