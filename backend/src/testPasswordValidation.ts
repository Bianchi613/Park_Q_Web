import * as bcrypt from 'bcrypt';
import 'dotenv/config';

console.log('Iniciando a validacao da senha');

const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const testPassword = requiredEnv('TEST_USER_PASSWORD');

async function createUser() {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(testPassword, saltRounds);

  console.log(`Senha original: ${testPassword}`);
  console.log(`Hash da senha gerada: ${hashedPassword}`);

  return hashedPassword;
}

async function checkPassword(providedPassword, storedHash) {
  const isPasswordValid = await bcrypt.compare(providedPassword, storedHash);

  console.log(`Senha fornecida: ${providedPassword}`);
  console.log(`Hash armazenado: ${storedHash}`);
  console.log(`Senha valida? ${isPasswordValid ? 'Sim' : 'Nao'}`);
}

async function testPasswordValidation() {
  const storedHash = await createUser();

  await checkPassword(testPassword, storedHash);
  await checkPassword('wrongpassword', storedHash);
}

testPasswordValidation();
