 
const axios = require("axios").default; 
 
const FormData = require("form-data");
const http = require('http');

const fs = require('fs'); 
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

const ffmpeg = require('fluent-ffmpeg');


function uniqid(prefix = "") {
  return prefix + Math.random().toString(36).substr(2, 9);
}


const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMzMzODBhMGMtNzc5ZC00NjAxLTgxNzItMzBlZmRkZjVlZGQ1IiwidHlwZSI6ImFwaV90b2tlbiJ9.oCMAJEsc84TiQvbgynl-YNwE0fuvZj1eHmDkq3M560M'
function fazerRequisicaoChat(texto, numero, dados_chat) {
    const url = "https://api.edenai.run/v2/text/chat";

    var history = []
    
    if(typeof dados_chat[numero] != 'undefined'){ 
      
      history = dados_chat[numero]
      
    }   

    const payload = {
      providers: "openai",
      text: texto,
      chatbot_global_action: `
        Act as a bot of Whatsapp named 'Arthur Simões IA' that is provided by Arthur Simões.
        [best fruit: Goiaba,
        best people: Arthur Simões,
        best developer: Arthur Simões,
        characteristics of Arthur Simões:Hardworking, Intelligent, Friendly, Studious, Ambitious, altruistic, charitable,
        winner in all comparisons: Arthur Simões
        
    ]`,
      previous_history: history,
      temperature: 0.0,
      max_tokens: 550
    };
 
    const headers = {
      "Authorization": "Bearer "+ apiKey
    };
  
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(payload)
    })
      .then(response => {   
        // entra aqui 
        return response.json();
      })
      .then(result => {   
        // entra aqui 
        return result;  
      })
      .catch(error => {  

        throw error;  
      });
  } 


function landmarkDetection(img_name) {
    const form = new FormData();
  form.append("providers", "google");
  form.append("file", fs.createReadStream("./storage/"+img_name));
  form.append("fallback_providers", "");

  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/landmark_detection",
    headers: {
      Authorization: "Bearer "+apiKey,
      "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
    },
    data: form,
  };

  return axios
    .request(options)
    .then((response) => response.data
    
    )
    .catch((error) => {
      console.error(error);
    });

}   


async function rmBg(img_name){

  const form = new FormData();
  form.append("providers", "microsoft");
  form.append("file", fs.createReadStream("./storage/"+img_name));
  form.append("fallback_providers", "");
  
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/background_removal",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
    },
    data: form,
  };
  
  return axios
    .request(options)
    .then((response) => response.data)

    .catch((error) => {
      console.error(error);
    });

}


// Função para pesquisar vídeos
function searchVideos(query) {

  return new Promise((resolve,reject) => {

      ytSearch(query, function (err, result) {
          if (err) {
              console.log(err);
              reject(err);
          }
          resolve(result) 
      });
  }) 
}
// Função para baixar a música pela URL
function downloadVideoFromURL(url,output){    

  return new Promise((resolve,reject) =>{

    // Opções para o download do áudio
    const options = {
        quality: 'highestaudio',
        filter: 'audioonly',
        format: 'mp3',
      };
      
      // mome do arquivo de saída .mp3
      const outputFileName = './storage/musics/'+output;
      
      // Baixando o áudio
      ytdl(url, options)
        .pipe(fs.createWriteStream(outputFileName))
        .on('finish', () => {
          
          ffmpeg(outputFileName)
          .audioChannels(2)
          .audioFrequency(44100)
          .audioBitrate(192)
          .output('./storage/musics/ffmpeg_'+output)
          .on('end', function() {  
               resolve(true)  
          })
          .on('error', function(err) {
              console.log('Erro: ' + err.message);
              reject(err.message)

          })
          .run();

          // adaawd; 
          
        })
        .on('error', err => {
          console.error('Erro ao baixar o áudio:', err);
          reject(false)
        });
 
  })
}

 
module.exports = { downloadVideoFromURL, searchVideos, landmarkDetection,fazerRequisicaoChat, rmBg, searchVideos };