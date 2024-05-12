const { getApiData } = require('./readApi.js');
const { stringify } = require('csv-stringify/sync');

const cols = [
  'Id',
  'Nome do Abrigo',
  'Suprimentos necessários',
  'Contato',
  'Capacidade',
  'Número de abrigados atualmente',
  'Endereço',
  'pix',
  'Verificado',
  'Aceita animais',
  'Criado em',
  'Atualizado em',
];

const TABLE_URI = '';

const TOKEN = ''

const writeToAirtable = async data => {
  const response = await fetch(TABLE_URI, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      'Content-Type': 'text/csv',
    },
    body: data,
  });

  const responseData = await response.json();

  return responseData;
};

async function main() {
  try {
    const apiDataPromise = getApiData();

    const apiData = await apiDataPromise;

    const dataArr = [cols, ...Object.values(apiData)];

    const csvData = stringify(dataArr);

    const results = await writeToAirtable(csvData);

    return JSON.stringify(results);
  } catch (error) {
    return error;
  }
}

async function mainLoop() {
  // eslint-disable-next-line
  while (true) {
    const results = await main();
    console.log(new Date().toISOString(), results);
    await new Promise(r => setTimeout(r, 60000));
  }
}

mainLoop().then();
