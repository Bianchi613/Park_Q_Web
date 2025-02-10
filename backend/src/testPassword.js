const bcrypt = require('bcrypt');
const { Client } = require('pg'); // Utilizando o PostgreSQL com o pacote 'pg'

// Configuração da conexão com o banco de dados
const client = new Client({
  user: 'postgres',  // Usuário do banco
  host: 'localhost', // Servidor do banco de dados
  database: 'parkq', // Nome do banco de dados
  password: '12345', // Senha do banco
  port: 5432,        // Porta padrão do PostgreSQL
});

// Conectar ao banco de dados
client.connect();

// Senha que você quer gerar o hash
const senha = '12345';

// Gerando o hash com um salt de 10 rounds (pode ajustar o número conforme necessário)
bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    client.end(); // Encerra a conexão se ocorrer erro
  } else {
    console.log('Hash gerado:', hash);

    // Atualizando o hash da senha no banco de dados
    const updateQuery = `
      UPDATE "Usuarios" 
      SET "senha" = $1 
      WHERE "email" = 'alan@bianchi.com'`;  // Altere o critério conforme necessário

    // Executando a query para atualizar o banco de dados
    client.query(updateQuery, [hash], (err, res) => {
      if (err) {
        console.error('Erro ao atualizar o banco:', err);
      } else {
        console.log('Senha do usuário atualizada com sucesso!');
      }
      // Finaliza a conexão com o banco de dados
      client.end();
    });
  }
});
