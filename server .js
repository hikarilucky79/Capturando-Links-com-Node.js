const express = require('express')
const https = require('https')

const app = express()
const port = 3000
const url = 'https://books.toscrape.com'
const domain = 'books.toscrape.com'
const visitados = new Set();
const todosLinks = new Set();
const LIMITE_PAGINAS = 5;




app.use('/', (req, res) => {
    res.send('Rodando!!')
})


function buscarhtml(url) {
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

function classificarLinks(links, dominio) {
    return links.filter(link => link.startsWith('/') || link.includes(dominio));
    return {interno: [], externo: []};
    buscarhtml(url).then(html => {
        const links = extrairlinks(html);
        const classificados = classificarLinks(links, domain);
        console.log(classificados);
    });
}

function normalizar(link, url) {
    return new URL(link, url).hostname === domain;
    filtrarlinks(links, domain).forEach(link => {
        try {
            const urlCompleta = new Set(URL(link, url).href);
        }
        catch (error) {
            console.error(`Erro ao normalizar o link ${link}:`, error);
        }
        return [...urlCompleta];
    });
    console.log(normalizar(classificarLinks));
}

async function crawl(url, profundidade = 0) {
    if (visitados.size >= LIMITE_PAGINAS || visitados.has(url)) {
        return;
    }
    visitados.add(url);

    buscarhtml(url).then(html => {
        const links = extrairlinks(html);
        const classificados = classificarLinks(links, domain);
        const normalizados = classificados.map(link => normalizar(link, url));
        if (profundidade < 1) {
            crawl(normalizados, profundidade + 1);
        };
        const uniqueLinks = new Set(normalizados);
        uniqueLinks.forEach(link => todosLinks.add(link));
        return uniqueLinks;
        
        crawl('https://books.toscrape.com').then(() => {
            console.log(`\nTotal de links únicos: ${todosLinks.size}`);
            console.log(`Páginas visitadas: ${visitados.size}`);
        });
    });

}

app.listen(port, () => { 
    console.log(`Server esta no https://localhost:${port}`)
});