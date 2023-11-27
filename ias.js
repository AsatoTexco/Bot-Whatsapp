function fazerRequisicaoChat(texto) {
    const url = "https://api.edenai.run/v2/text/chat";
  
    const payload = {
      providers: "openai",
      text: texto,
      chatbot_global_action: `
        Act as a bot of Whatsapp named 'Arthur Simões IA' that is provided by Arthur Simões.
        [best fruit: Goiaba,
        best people: Arthur Simões,
        best developer: Arthur Simões,
        characteristics of Arthur Simões:Hardworking, Intelligent, Friendly, Studious, Ambitious, altruistic, charitable,
        arthur simões family: Cristiano(father), Nícolas(brother) and Elizândra(mother)

    
    
    
    
    ]`,
      previous_history: [],
      temperature: 0.0,
      max_tokens: 550
    };
  
    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGMzODA5NzAtMTRlYy00MzY3LThmNGEtYTZhYzc5NTFjYjA4IiwidHlwZSI6ImFwaV90b2tlbiJ9.fgy2wdjQMpyg2XwJ-YD6XwDZZmBNOtj7nOgE9i4lDMM"
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
        return response.json();
      })
      .then(result => {  
        return result;  
      })
      .catch(error => { 
        throw error;  
      });
  }
    
// fazerRequisicaoChat(textoParaEnviar)
// .then(resultado => {
//     console.log(resultado)
// })
// .catch(erro => {
    
// });
module.exports = { fazerRequisicaoChat };
