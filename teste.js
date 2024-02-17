// const fs = require('fs'); 
// const ytSearch = require('yt-search');
// const ytdl = require('ytdl-core');
  

// function uniqid(prefix = "") {
//     return prefix + Math.random().toString(36).substr(2, 9);
// } 


// // Função para pesquisar vídeos
// function searchVideos(query) {

//     return new Promise((resolve,reject) => {

//         ytSearch(query, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             }
//             resolve(result) 
//         });
//     }) 
// }
// // Função para baixar a música pela URL
// function downloadVideoFromURL(url,output){    
//     // Opções para o download do áudio
//     const options = {
//         quality: 'highestaudio',
//         filter: 'audioonly',
//         format: 'mp3',
//       };
      
//       // mome do arquivo de saída .mp3
//       const outputFileName = './storage/musics/'+output;
      
//       // Baixando o áudio
//       ytdl(url, options)
//         .pipe(fs.createWriteStream(outputFileName))
//         .on('finish', () => {
//             return true
//         })
//         .on('error', err => {
//           console.error('Erro ao baixar o áudio:', err);
//           return false
//         });
// }


// // ================  [EXEMPLO DE USO]  ================
// // searchVideos('VALHALLA')
// // .then((res) => {

// //     console.log(res.videos[0])
// //     downloadVideo(res.videos[0].url,uniqid('music')+'.mp3') 

// // })
// // .catch((err)=>{
// //     console.log('Erro:'+err)
// // })


let msg_author = '$music kaan mary jane'.replace('$music ','')
console.log(msg_author)
