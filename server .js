const express = require('express')
const https = require('https')

const app = express()
const port = 3000
const url = 'https://books.toscrape.com'

app.use('/', (req, res) => {
    res.send('Rodando!!')
})


function buscarLivros(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                console.log(html);
                resolve(html);
            });
            
        });
    });
}

function extrairlinks(html) {
    const regex = /<a href="(.*?)"/g;
    const matches = [...html.matchAll(regex)];
    const links = matches.map(match => match[1]);
    return links;
};

// 1. O que acontece se a URL usar HTTP em vez de HTTPS? O mesmo módulo funciona?
// R: O módulo 'https' é específico para URLs que usam o protocolo HTTPS. Se a URL usar HTTP, o módulo 'https' não funcionará corretamente e resultará em um erro. Para URLs HTTP, você deve usar o módulo 'http' em vez do 'https'.

// 2. Por que o evento 'data' pode ser disparado múltiplas vezes?
// R: O evento 'data' é disparado sempre que uma parte dos dados da resposta é recebida.


app.listen(port, () => {
    console.log(`Server esta no https://localhost:${port}`)
});