const fs = require('fs').promises;

// Função para corrigir nomes de marca e veículo
function corrigirNomes(bancoDados) {
    bancoDados.forEach(registro => {
        if (registro.marca) {
            registro.marca = registro.marca.replace(/æ/g, 'a').replace(/ø/g, 'o');
        }
        if (registro.nome) {
            registro.nome = registro.nome.replace(/æ/g, 'a').replace(/ø/g, 'o');
        }
    });
}

// Função para corrigir valores de vendas para o tipo number
function corrigirValoresVendas(bancoDados) {
    bancoDados.forEach(registro => {
        // Verificar se o valor de vendas é uma string e pode ser convertido para número
        if (typeof registro.vendas === 'string' && /^\d+$/.test(registro.vendas)) {
            registro.vendas = Number(registro.vendas);
        }
    });
}

Promise.all([
    fs.readFile('broken_database_1.json', 'utf-8').then(JSON.parse),
    fs.readFile('broken_database_2.json', 'utf-8').then(JSON.parse)
])
    .then(([bancoDados1, bancoDados2]) => {
        corrigirNomes(bancoDados1);
        corrigirNomes(bancoDados2);
        corrigirValoresVendas(bancoDados1);
        corrigirValoresVendas(bancoDados2);

        // Exibindo dados corrigidos no console em formato JSON
        const dadosCorrigidos = bancoDados1.concat(bancoDados2);
        console.log(JSON.stringify(dadosCorrigidos, null, 2));

        // Escrever os dados corrigidos em novos arquivos JSON
        return Promise.all([
            fs.writeFile('dados_corrigidos_1.json', JSON.stringify(bancoDados1, null, 2)),
            fs.writeFile('dados_corrigidos_2.json', JSON.stringify(bancoDados2, null, 2)),
            fs.writeFile('dados_corrigidos.json', JSON.stringify(dadosCorrigidos, null, 2))
        ]);
    })
    .catch(error => console.error(error));
