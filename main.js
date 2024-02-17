const { searchVideos, fazerRequisicaoChat,landmarkDetection, rmBg, downloadVideoFromURL } = require('./ias.js');

const axios = require('axios');
const fs = require('fs'); 
const Jimp = require('jimp'); 

var dados_chat = {}

const qrcode = require('qrcode-terminal'); 
 
const { Client, MessageMedia, NoAuth } = require('whatsapp-web.js');

const client = new Client(
{
	puppeteer: {
		args: ['--no-sandbox'], 
        authStrategy: new NoAuth()
	}
}
);


client.on('qr', qr => {
    // console.log('qr code: '+qr)
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');

    // // MENSAGENS TEMPORARIAS 
    // console.log("Mensagens temporizadas ativadas") 
    // // true = podem mandar msg 
    // var pri = true 
    // var seg = true 
    // var ter = true 
    // var qua = true  
    // var count = 0

    // ativacaoTemp = setInterval(() => {   
    //     let data = new Date()
    //     let hours = data.getHours() - 1 
    //     if(hours == 8){ 
    //         if(count == 4){
    //             pri = false
    //         } 
    //         if(pri == true){ 
    //             client.sendMessage('556791549407' +'@c.us','Informo que a aula do Arthur no SENAC está agendada para hoje, iniciando pontualmente às 13:30.')
    //             count = count + 1 
    //         }
    //     }
    //     if(hours == 10){ 
    //         if(pri == false){
    //             count = 0
    //             pri = true
    //         } 
    //         if(count == 4){
    //             seg = false
    //         } 
    //         if(seg == true){ 
    //             client.sendMessage('556791549407' +'@c.us','Arthur tem aula hj no SENAC às 13:30')
    //             count = count + 1 
    //         } 
    //     }
    //     if (hours == 11){  
    //         if(seg == false){
    //             count = 0
    //             seg = true
    //         } 
    //         if(count == 4){
    //             ter = false
    //         } 
    //         if(ter == true){ 
    //             client.sendMessage('556791549407' +'@c.us','Passando novamente para lembrar que o Arthur tem Aula no SENAC às 13:30')
    //             count = count + 1 
    //         }  
    //     } 
    //     if(hours == 12){  
    //         if(ter == false){
    //             count = 0
    //             ter = true
    //         } 
    //         if(count == 4){
    //             qua = false
    //         } 
    //         if(qua == true){ 
    //             client.sendMessage('556791549407' +'@c.us','Opa, olhe só, será que Arthur ja esta acordado? faltam apenas 1 hora e meia para sua aula começar')
    //             count = count + 1 
    //         }
    //     }  
    // },5000)
    // =====================
    
});



client.on('message',async message => {
   
    
    // from: 120363037418783477@g.us
    // to: 556793538415@c.us
    // author: 556792743524@c.us
    // deviceType: android

    if(message.hasMedia){
        console.log(message.from + " (media)");

        if(message.body.startsWith('$local')){
            let data64 = await message.downloadMedia() 
            let img_name = armazenarImg(data64.data) 
             
            setTimeout(() => { 
                landmarkDetection(img_name)
                            .then(resultado => {  
                                if(resultado.google.items.length > 0){
                                    let msg = '*Locais semelhantes*' 
                                    for(chave in resultado.google.items){
                                        msg += '\n'+(parseInt(chave)+1) + ' - ' + resultado.google.items[chave].description + '\n' + (resultado.google.items[chave].confidence * 100) +'%\n'
                                    } 
                                    message.reply(msg)
                                } else{
    
                                    let msg = "Infelizmente não consegui encontrar o seu local :("
                                    message.reply(msg) 
                                }
                            })
                            .catch(erro => {
                                
                            });
            }, 2000);

        }else if(message.body.startsWith('$bg')){


            let data64 = await message.downloadMedia() 
            let img_name = armazenarImg(data64.data)

            setTimeout(() => { 

                rmBg(img_name)
                .then(resultado => {  
                    if(resultado.microsoft.status == 'success'){

                        let foto = new MessageMedia('image/png', resultado.microsoft.image_b64);
                        message.reply(foto)

                    }else{
                        message.reply('Ops, aconteceu um erro aqui')

                    } 
                }) 

            },1000) 

        }else if(message.body.startsWith('$fig')){

            console.log('FIG')
            
            // fazer a figurinha 
            let data64 = await message.downloadMedia() 
            let img_name = armazenarImg(data64.data)

            setTimeout(async () => { 


                let imageBuffer = await convertImageToSticker(img_name)
                const media = new MessageMedia('image/png', imageBuffer.toString('base64'));
                message.reply(media,undefined,{
                    sendMediaAsSticker:true,
                    
                });


            },1000)  
        }

    }else{

        if(message.body.startsWith('$play')){    

            console.log(message.from + ': Play Music')
            let msg_author = message.body.replace('$music ', '')

            let dataVideo = await searchVideos(query=msg_author)
            
            let output_archive = uniqid('music_')+'.mp3'

             
            downloadVideoFromURL(dataVideo.videos[0].url, output_archive)
            .then(async (res) => {
            
                try {
                    
                    let imgBase64 = await getBase64Image(dataVideo.videos[0].thumbnail)

                    let img_thumbnail = new MessageMedia('image/jpg',imgBase64)
                    await client.sendMessage(message.from, img_thumbnail) 


                    let audio = MessageMedia.fromFilePath('./storage/musics/ffmpeg_'+output_archive)  
                    message.reply(audio,undefined,{
                        sendAudioAsVoice:true
                    })


                } catch (error) {
                    console.log("Erro: "+error.message)
                }  
            })
            .catch((e) => {
                console.log(e)
            })  
            .finally(() => {

                fs.unlinkSync('./storage/musics/'+output_archive)
                fs.unlinkSync('./storage/musics/ffmpeg_'+output_archive)

            })
            
        }else{ 

            // se a mensagem foi enviada de um grupo 
            if(message.from.includes('@g.us')){
                console.log(message.from+" -> " + message.author + ": "+ message.body);
                if(message.mentionedIds != ''){
                    if(message.body.includes('@556793538415')){
                        
                        fazerRequisicaoChat(message.body,message.from,dados_chat)
                        .then(resultado => {
    
                            message.reply(resultado.openai.generated_text) 
                            let resposta = resultado.openai.generated_text
                            
                            if(typeof dados_chat[message.from] ===  'undefined'){  
                                // iniciando um historico para o numero de celular 
                                dados_chat[message.from] = [
                                    { 
                                        role: 'user',
                                        message: message.body, 
                                    },
    
                                    { 
                                        role: 'assistant',
                                        message: resposta, 
                                    }
                                ]
                            }else{ 
                                // adicionando mais uma mensagem ao historico
                                dados_chat[message.from].push(
                                    { 
                                        role: 'user',
                                        message: message.body, 
                                    }
                                )
                                dados_chat[message.from].push(
                                    { 
                                        role: 'assistant',
                                        message: resposta, 
                                    }
                                ) 
                                }  
                                // message.reply(resultado.openai.generated_text) 
                            })
                        .catch(erro => {
                            
                        });
                    }
                }
        
            }else{
                // mensagem enviada no particular 
                console.log(message.from+": "+ message.body); 
     
                fazerRequisicaoChat(message.body, message.from,dados_chat)
                .then(resultado => {
                    // console.log('resultado(main.js): ')
                    // console.log(resultado.error)
                    message.reply(resultado.openai.generated_text) 
                    let resposta = resultado.openai.generated_text
                        
                    if(typeof dados_chat[message.from] ===  'undefined'){  
                        // iniciando um historico para o numero de celular 
                        dados_chat[message.from] = [
                            { 
                                role: 'user',
                                message: message.body, 
                            },
    
                            { 
                                role: 'assistant',
                                message: resposta, 
                            }
                        ]
                        }else{ 
                            // adicionando mais uma mensagem ao historico
                            dados_chat[message.from].push(
                            { 
                                role: 'user',
                                message: message.body, 
                            }
                            )
                            dados_chat[message.from].push(
                            { 
                                role: 'assistant',
                                message: resposta, 
                            }
                            ) 
                        }  
                })
                .catch(erro => {
                    console.log(erro)
                });  
            }  
        } 
    } 
})
 

function uniqid(prefix = "") {
    return prefix + Math.random().toString(36).substr(2, 9);
}

async function convertImageToSticker(img_name) {
    const imageFilePath = './storage/'+img_name; // Replace with the path to your image file
    const image = await Jimp.read(imageFilePath);

    // Resize the image to meet WhatsApp sticker requirements (512x512 pixels)
    image.resize(512, 512);

    // Convert the image to a buffer
    const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    return imageBuffer;
}

function mp3ToBase64(filePath) {
    try {
        // Ler o conteúdo do arquivo .mp3
        const mp3Data = fs.readFileSync(filePath);

        // Converter para base64
        const base64Data = mp3Data.toString('base64');

        return base64Data;
    } catch (error) {
        console.error('Erro ao converter arquivo .mp3 para base64:', error);
        return null;
    }
}

async function getBase64Image(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return base64;
}


function armazenarImg(base64){

    const base64Image = base64.split(';base64,').pop();

    // Caminho onde você quer salvar a imagem (pode ser um caminho absoluto)
    let nameImg = uniqid()+'img64.png'
    const filePath = './storage/'+ nameImg; 
    // Escreve o conteúdo da imagem no arquivo
    fs.writeFile(filePath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Erro ao salvar a imagem:', err);
        } else {
            console.log('Imagem salva com sucesso em:', filePath);
        }
    });

    return nameImg

}



client.initialize();
 