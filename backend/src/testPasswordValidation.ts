const bcrypt = require('bcrypt');
console.log('Iniciando a validação da senha');

// Função para simular a criação de um usuário
async function createUser() {
  const password = '12345';  // Senha fornecida pelo usuário
  const saltRounds = 10;  // Número de rounds de salt

  // Gerar o hash da senha
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log(`Senha original: ${password}`);
  console.log(`Hash da senha gerada: ${hashedPassword}`);

  return hashedPassword;  // Retorna o hash gerado
}

// Função para verificar a senha fornecida com o hash armazenado
async function checkPassword(providedPassword, storedHash) {
  // Verifica se a senha fornecida corresponde ao hash armazenado
  const isPasswordValid = await bcrypt.compare(providedPassword, storedHash);

  console.log(`Senha fornecida: ${providedPassword}`);
  console.log(`Hash armazenado: ${storedHash}`);
  console.log(`Senha válida? ${isPasswordValid ? '✅ Sim' : '❌ Não'}`);
}

// Função principal para testar a criação e verificação da senha
async function testPasswordValidation() {
  const storedHash = await createUser();  // Simula a criação de um usuário e salva o hash da senha

  // Verifica a senha fornecida pelo usuário
  const providedPassword = '12345';  // Senha fornecida pelo usuário na tentativa de login
  await checkPassword(providedPassword, storedHash);  // Verifica se a senha fornecida corresponde ao hash armazenado

  const wrongPassword = 'wrongpassword';  // Senha incorreta para testar a falha de login
  await checkPassword(wrongPassword, storedHash);  // Verifica se a senha errada não passa
}

testPasswordValidation();
