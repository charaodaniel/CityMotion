
/**
 * CityMotion Emergency CLI
 * Ferramenta para acesso direto via terminal da máquina caso a interface web falhe.
 * Uso: node nexus-cli.js <path>
 */

const http = require('http');

const path = process.argv[2] || 'status';
const method = process.argv[3] || 'GET';
const body = process.argv[4] ? JSON.parse(process.argv[4]) : null;

console.log(`\x1b[36m--- CityMotion NexusBridge CLI ---\x1b[0m`);
console.log(`Requisição: ${method} /api/nexus/${path}\n`);

const options = {
  hostname: 'localhost',
  port: 9002,
  path: `/api/nexus/${path}`,
  method: method,
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
    } catch (e) {
        console.log(data);
    }
    console.log(`\n\x1b[32mStatus: ${res.statusCode}\x1b[0m`);
  });
});

req.on('error', (error) => {
  console.error(`\x1b[31mErro de conexão: ${error.message}\x1b[0m`);
  console.log('Certifique-se de que o frontend (Next.js) está rodando na porta 9002.');
});

if (body) {
  req.write(JSON.stringify(body));
}
req.end();
