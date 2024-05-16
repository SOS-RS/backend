import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { parse as createParser } from 'csv';
import { Readable } from 'node:stream';

const logger = new Logger('ShelterCsvImporterHelpers');

export const createCsvParser = () =>
  createParser({ columns: true, relaxColumnCount: true }, function (err, data) {
    if (err) {
      logger.error(err);
      return null;
    }
    return data;
  });

export function translatePrismaError(err: PrismaClientKnownRequestError) {
  switch (err.code) {
    case 'P2002':
    case 'P2003':
    case 'P2004': {
      let msg = `PrismaError(${err.code}): Constraint error ocurred`;
      if (err.meta?.modelName && err?.meta.target) {
        msg += ` for `;
        if (Array.isArray(err?.meta.target)) {
          for (const prop of err?.meta.target) {
            msg += `${err.meta?.modelName}."${prop}"`;
          }
        } else {
          msg += `${err.meta.target}`;
        }
      }

      return msg;
    }

    default:
      return err.message;
  }
}

export async function detectSupplyCategoryUsingAI(
  input: unknown,
  categoriesAvailable: string[],
): Promise<Record<string, string[]>> {
  if (typeof input !== 'string') {
    logger.warn(`Input inesperado recebido: ${input}`);
    return {};
  }
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Required ENV variable: GEMINI_API_KEY');
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro-latest',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: `Você é um classificador de itens donativos para tragédias ambientais.\nCategorize os INPUT em uma das seguintes categorias: ${categoriesAvailable.join(', ')}. Retorne um JSON com a seguitne assinatura: Record<nomeCategoria, produtos[]>. Cada produto pode ter apenas uma categoria.`,
          },
          {
            text: 'Lanternas, Roupas para crianças, Comidas Não Perecíveis, Pratos, Lençóis, Cadeiras (tipo de praia), Absorventes higiênicos, Kits de primeiros socorros, Fórmula infantil, Colchões, Caixas de papelão, Lixeiras, Carne Gado, Gaze, Termômetro, Álcool, Repelente, Massa, Descarpack Caixa, Mamadeira, Soro, Chupeta/bico, Lenços umedecidos, Sabonetes, Escova de dentes, Shampoo e Condicionador, Plus Size/GG, Pás, Desodorante, Voluntário - Noite, Shampoo, Veterinários, Luvas, Remédios básicos, Roupas íntimas, Medicamentos prescritos, Turnos de manhã, Turnos de noite, Fraldas, Ventilador, Roupa Íntima (adulto) Feminina E Masculina, Luvas De Limpeza, Toalhas de banho, Ventiladores, Vassouras, Sacos de lixo, Pomadas, Feijão, Tênis, Chinelos, Oléo, Roupas para frio, Leite em pó, Gelo, Azitotromicina, Papel higiênico, Sacolinhas plasticas para kits, Gás, Ração para animais, Antibiótico, Suco de caixinha, Jornal (para xixi e coco), Caixa de areia (gato), Voluntários Para Animais (não Necessariamente Veterinário/a), Alimentos Diets, Luz de Emergência, Lanterna, Lonas, Água, Travesseiros/almofada, Chinelos masculinos, Água potável, Itens de limpeza, Roupa Íntima Infantil, Roupas Masculinas G E Gg, Azeite, Roupa íntima masculina e feminina, Roupas femininas G/GG, Roupa plus size, Arroz, Roupas grandes, Esponjas De Louça, Roupas para adultos, Sapato Infantil, Turno da madrugada, Sabão em pó, Pasta de dente, Caminhão Pipa, Fralda RN, Produtos de desinfecção (cloro, álcool), Copos, Voluntário - Madrugada, Roupas Femininas, Roupa Masculina, Roupas Pluz Size, Rolo Lona Preta 40m x 6m (mais grossa), Lona, Fraldas Geriatricas, Cordas, Casinha para cachorro, Lar Temporário Para Animais, Ponto De Resgate, Caixas de transporte para pets, Álcool em gel, Coleiras, Mascara, Cesta Básica, Roupa Masculina Gg, Patê Para Cachorro, Roupa Infantil Menino, Fita Durex larga, Papagaio - Urinar, Papagaio, Cama Geriatria, Escova de cabelo, Toalhas, Cadeira De Rodas, Leitos para animais, SACOS DE AREIA, Caixa De Transporte, Areia de gato, Macarrão, Desinfetante, Café, Pente/Escova de cabelo, Condicionador, Gilete, Alimentos para consumo rápido (Leite, bolacha, suco, etc), Colher Descartável, Lanches, Tapete higiênico, Medicamentos veterinários, Cobertores, Pão, Pão De Sanduíche, Sucos, Papel toalha, TELAS / CHIQUEIROS, Banana, Cebola, Frutas, Alface, Tomate, Luva G, Jogo de cartas, baralho, dama e dominó, etc, Seringa De Insulina, Seringa 3 E 5ml Com Agulha 70x30, ROUPAS INTIMAS - CUECAS - G, Bermuda Masculina, Hipoglós, Talheres, Tapetes higiênicos, Guardanapo de papel, Médicos, Psicólogos, Papelão, Voluntário - Manhã, Roupa Infantil 8-10 Anos, Roupa Masculina Adulta, Assistentes Sociais, Leite, Fralda P, Embalagem descartável para as marmitas, Sabonete infantil, Turnos de tarde, Antipulgas - Animais Pequeno Porte, Higiene Pessoal, Produtos de higiene, Garfo e faca, Pano de chão, Pano de prato, Potes (marmitex), Pilha Aa, Guarda-sol, Pomada para assadura, Fraldas Adultas, Meias, Luvas descartáveis, Baldes, Travesseiro, Talher Descartável, Detergente, Água Sanitária, Chimia, Sabonete Líquido, Luva de Latex Descartável, Pano De Chão / Saco Alvejado, Probiótico Para Animais, Escova Para Limpar Mamadeira, Molho de tomate, Açúcar, Voluntário - Tarde, Roupas leves, Toucas, Luvas Descartáveis, Lenço umedecido, Luminárias com pedestal para área saúde 1m altura pelo menos, Ganchos para montar varal, Freezer para armazenar comida, Máquina de lavar roupa, Luvas para limpeza, Bermudas, Assento para vaso sanitário, Calçado masculino, Jornal/Papelão, Frios, Carne Frango, Farinha, Travesseiros, Fronhas, Elástico Para Cabelo, Roupas plus size feminina, Malas de Viagem, Banheiro Químico (apenas Chuveiro), Bonés, Produtos de limpeza, Pano De Limpeza, Bolachinha, Vassouras e rodos, Fralda XG e XXG, Creme de pentear, Fita adesiva (durex), Roupa íntima feminina, Ração gato, Capas de chuva, Toalha de Banho, Guarda-chuva, Farinha de trigo, Gatorade/Isotônico, Latas de lixo, Massinha De Modelar, Roupas plus size masculino, Saco De Lixo De Vários Tamanhos, Baralhos, Erva Mate, Touca Descartável Sal, Polenta, Calçados, Itens de higienLanternas, Roupas para crianças, Comidas Não Perecíveis, Pratos, Lençóis, Cadeiras (tipo de praia), Absorventes higiênicos, Kits de primeiros socorros, Fórmula infantil, Colchões, Caixas de papelão, Lixeiras, Carne Gado, Gaze, Termômetro, Álcool, Repelente, Massa, Descarpack Caixa, Mamadeira, Soro, Chupeta/bico, Lenços umedecidos, Sabonetes, Escova de dentes, Shampoo e Condicionador, Plus Size/GG, Pás, Desodorante, Voluntário - Noite, Shampoo, Veterinários, Luvas, Remédios básicos, Roupas íntimas, Medicamentos prescritos, Turnos de manhã, Turnos de noite, Fraldas, Ventilador, Roupa Íntima (adulto) Feminina E Masculina, Luvas De Limpeza, Toalhas de banho, Ventiladores, Vassouras, Sacos de lixo, Pomadas, Feijão, Tênis, Chinelos, Oléo, Roupas para frio, Leite em pó, Gelo, Azitotromicina, Papel higiênico, Sacolinhas plasticas para kits, Gás, Ração para animais, Antibiótico, Suco de caixinha, Jornal (para xixi e coco), Caixa de areia (gato), Voluntários Para Animais (não Necessariamente Veterinário/a), Alimentos Diets, Luz de Emergência, Lanterna, Lonas, Água, Travesseiros/almofada, Chinelos masculinos, Água potável, Itens de limpeza, Roupa Íntima Infantil, Roupas Masculinas G E Gg, Azeite, Roupa íntima masculina e feminina, Roupas femininas G/GG, Roupa plus size, Arroz, Roupas grandes, Esponjas De Louça, Roupas para adultos, Sapato Infantil, Turno da madrugada, Sabão em pó, Pasta de dente, Caminhão Pipa, Fralda RN, Produtos de desinfecção (cloro, álcool), Copos, Voluntário - Madrugada, Roupas Femininas, Roupa Masculina, Roupas Pluz Size, Rolo Lona Preta 40m x 6m (mais grossa), Lona, Fraldas Geriatricas, Cordas, Casinha para cachorro, Lar Temporário Para Animais, Ponto De Resgate, Caixas de transporte para pets, Álcool em gel, Coleiras, Mascara, Cesta Básica, Roupa Masculina Gg, Patê Para Cachorro, Roupa Infantil Menino, Fita Durex larga, Papagaio - Urinar, Papagaio, Cama Geriatria, Escova de cabelo, Toalhas, Cadeira De Rodas, Leitos para animais, SACOS DE AREIA, Caixa De Transporte, Areia de gato, Macarrão, Desinfetante, Café, Pente/Escova de cabelo, Condicionador, Gilete, Alimentos para consumo rápido (Leite, bolacha, suco, etc), Colher Descartável, Lanches, Tapete higiênico, Medicamentos veterinários, Cobertores, Pão, Pão De Sanduíche, Sucos, Papel toalha, TELAS / CHIQUEIROS, Banana, Cebola, Frutas, Alface, Tomate, Luva G, Jogo de cartas, baralho, dama e dominó, etc, Seringa De Insulina, Seringa 3 E 5ml Com Agulha 70x30, ROUPAS INTIMAS - CUECAS - G, Bermuda Masculina, Hipoglós, Talheres, Tapetes higiênicos, Guardanapo de papel, Médicos, Psicólogos, Papelão, Voluntário - Manhã, Roupa Infantil 8-10 Anos, Roupa Masculina Adulta, Assistentes Sociais, Leite, Fralda P, Embalagem descartável para as marmitas, Sabonete infantil, Turnos de tarde, Antipulgas - Animais Pequeno Porte, Higiene Pessoal, Produtos de higiene, Garfo e faca, Pano de chão, Pano de prato, Potes (marmitex), Pilha Aa, Guarda-sol, Pomada para assadura, Fraldas Adultas, Meias, Luvas descartáveis, Baldes, Travesseiro, Talher Descartável, Detergente, Água Sanitária, Chimia, Sabonete Líquido, Luva de Latex Descartável, Pano De Chão / Saco Alvejado, Probiótico Para Animais, Escova Para Limpar Mamadeira, Molho de tomate, Açúcar, Voluntário - Tarde, Roupas leves, Toucas, Luvas Descartáveis, Lenço umedecido, Luminárias com pedestal para área saúde 1m altura pelo menos, Ganchos para montar varal, Freezer para armazenar comida, Máquina de lavar roupa, Luvas para limpeza, Bermudas, Assento para vaso sanitário, Calçado masculino, Jornal/Papelão, Frios, Carne Frango, Farinha, Travesseiros, Fronhas, Elástico Para Cabelo, Roupas plus size feminina, Malas de Viagem, Banheiro Químico (apenas Chuveiro), Bonés, Produtos de limpeza, Pano De Limpeza, Bolachinha, Vassouras e rodos, Fralda XG e XXG, Creme de pentear, Fita adesiva (durex), Roupa íntima feminina, Ração gato, Capas de chuva, Toalha de Banho, Guarda-chuva, Farinha de trigo, Gatorade/Isotônico, Latas de lixo, Massinha De Modelar, Roupas plus size masculino, Saco De Lixo De Vários Tamanhos, Baralhos, Erva Mate, Touca Descartável,  Sal, Polenta, Calçados, Itens de higiena pessoal, Achocolatado pronto, Roupas de Camas, Sacolas Para Montar Kits, Sacolas ou sacos plásticos, Técnico De Enfermagem, Enfermeirosa pessoal, Achocolatado pronto, Roupas de Camas, Sacolas Para Montar Kits, Sacolas ou sacos plásticos, Técnico De Enfermagem, Enfermeiros',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: '{"medicamentos": ["Kits de primeiros socorros", "Gaze", "Termômetro", "Álcool", "Repelente", "Soro", "Remédios básicos", "Medicamentos prescritos", "Pomadas", "Azitotromicina", "Antibiótico", "Álcool em gel", "Pomada para assadura", "Desinfetante", "Medicamentos veterinários", "Seringa De Insulina", "Seringa 3 E 5ml Com Agulha 70x30", "Hipoglós", "Antipulgas - Animais Pequeno Porte", "Probiótico Para Animais"], "cuidados com animais": ["Ração para animais", "Caixa de areia (gato)", "Voluntários Para Animais (não Necessariamente Veterinário/a)", "Coleiras", "Patê Para Cachorro", "Casinha para cachorro", "Lar Temporário Para Animais", "Caixas de transporte para pets", "Leitos para animais", "SACOS DE AREIA", "Caixa De Transporte", "Areia de gato", "TELAS / CHIQUEIROS", "Tapetes higiênicos", "Ração gato"], "especialistas e profissionais": ["Veterinários", "Voluntário - Noite", "Turnos de manhã", "Turnos de noite", "Turno da madrugada", "Voluntário - Madrugada", "Voluntário - Manhã", "Médicos", "Psicólogos", "Assistentes Sociais", "Turnos de tarde", "Voluntário - Tarde", "Técnico De Enfermagem", "Enfermeiros"], "acomodações e descanso": ["Lençóis", "Cadeiras (tipo de praia)", "Colchões", "Lonas", "Travesseiros/almofada", "Rolo Lona Preta 40m x 6m (mais grossa)", "Lona", "Cordas", "Cama Geriatria", "Cobertores", "Guarda-sol", "Travesseiro", "Luminárias com pedestal para área saúde 1m altura pelo menos", "Ganchos para montar varal", "Bermudas", "Capas de chuva", "Guarda-chuva", "Roupas de Camas"], "equipamentos de emergência": ["Lanternas", "Luz de Emergência", "Lanterna", "Ventilador", "Ventiladores", "Caminhão Pipa", "Fita Durex larga", "Cadeira De Rodas", "Pilha Aa", "Baldes"], "voluntariado": ["Voluntário - Noite", "Turnos de manhã", "Turnos de noite", "Turno da madrugada", "Voluntário - Madrugada", "Voluntário - Manhã", "Turnos de tarde", "Voluntário - Tarde"], "itens descartáveis": ["Pratos", "Descarpack Caixa", "Mamadeira", "Chupeta/bico", "Fraldas", "Sacos de lixo", "Sacolinhas plasticas para kits", "Jornal (para xixi e coco)", "Copos", "Papagaio - Urinar", "Colher Descartável", "Papel toalha", "Guardanapo de papel", "Embalagem descartável para as marmitas", "Garfo e faca", "Potes (marmitex)", "Talher Descartável", "Luva de Latex Descartável", "Escova Para Limpar Mamadeira", "Toucas", "Luvas Descartáveis", "Lenço umedecido", "Assento para vaso sanitário", "Jornal/Papelão", "Touca Descartável", "Sacolas Para Montar Kits", "Sacolas ou sacos plásticos"], "higiene pessoal": ["Absorventes higiênicos", "Lenços umedecidos", "Sabonetes", "Escova de dentes", "Shampoo e Condicionador", "Pás", "Desodorante", "Shampoo", "Roupas íntimas", "Roupa Íntima (adulto) Feminina E Masculina", "Toalhas de banho", "Papel higiênico", "Roupa Íntima Infantil", "Sabão em pó", "Pasta de dente", "Produtos de desinfecção (cloro, álcool)", "Escova de cabelo", "Toalhas", "Pente/Escova de cabelo", "Condicionador", "Gilete", "Tapete higiênico", "Sabonete infantil", "Higiene Pessoal", "Produtos de higiene", "Pano de chão", "Pano de prato", "Detergente", "Água Sanitária", "Chimia", "Sabonete Líquido", "Pano De Chão / Saco Alvejado", "Esponjas De Louça", "Lenço umedecido", "Luvas para limpeza", "Produtos de limpeza", "Pano De Limpeza", "Creme de pentear", "Toalha de Banho", "Itens de higiena pessoal"], "alimentos e água": ["Roupas para crianças", "Comidas Não Perecíveis", "Fórmula infantil", "Carne Gado", "Massa", "Feijão", "Oléo", "Leite em pó", "Gelo", "Suco de caixinha", "Alimentos Diets", "Água", "Chinelos masculinos", "Água potável", "Azeite", "Arroz", "Macarrão", "Café", "Alimentos para consumo rápido (Leite, bolacha, suco, etc)", "Lanches", "Pão", "Pão De Sanduíche", "Sucos", "Banana", "Cebola", "Frutas", "Alface", "Tomate", "Leite", "Molho de tomate", "Açúcar", "Frios", "Carne Frango", "Farinha", "Bolachinha", "Farinha de trigo", "Gatorade/Isotônico", "Massinha De Modelar", "Sal", "Polenta", "Achocolatado pronto"], "material de limpeza": ["Caixas de papelão", "Lixeiras", "Luvas De Limpeza", "Vassouras", "Sacos de lixo", "Itens de limpeza", "Produtos de desinfecção (cloro, álcool)", "Desinfetante", "Vassouras e rodos", "Latas de lixo", "Saco De Lixo De Vários Tamanhos"], "vestuário": ["Roupas para crianças", "Plus Size/GG", "Luvas", "Roupas para frio", "Roupas Masculinas G E Gg", "Roupa íntima masculina e feminina", "Roupas femininas G/GG", "Roupa plus size", "Roupas grandes", "Roupas para adultos", "Sapato Infantil", "Roupas Femininas", "Roupa Masculina", "Roupas Pluz Size", "Fraldas Geriatricas", "Mascara", "Roupa Masculina Gg", "Roupa Infantil Menino", "Roupas INTIMAS - CUECAS - G", "Bermuda Masculina", "Roupa Infantil 8-10 Anos", "Roupa Masculina Adulta", "Fralda P", "Fraldas Adultas", "Meias", "Roupas leves", "Bermudas", "Calçado masculino", "Roupas plus size feminina", "Bonés", "Roupa íntima feminina", "Fralda XG e XXG", "Roupas plus size masculino", "Calçados", "Roupa Íntima Infantil"], "veículos de resgate e transporte": ["Caminhão Pipa"], "eletrodomésticos e eletrônicos": ["Ventilador", "Ventiladores", "Luz de Emergência", "Lanterna", "Freezer para armazenar comida", "Máquina de lavar roupa", "Luminárias com pedestal para área saúde 1m altura pelo menos"], "mobílias": ["Cadeiras (tipo de praia)", "Colchões", "Cama Geriatria"], "jogos e passatempo": ["Jogo de cartas, baralho, dama e dominó, etc", "Baralhos"], "cosméticos": ["Shampoo e Condicionador", "Pás", "Desodorante", "Shampoo", "Creme de pentear"]}\n',
          },
        ],
      },
    ],
  });

  let promptOutput: Record<string, string[]> = {};
  try {
    const result = await chatSession.sendMessage(input);
    const response = result.response.text();
    promptOutput = JSON.parse(response);
  } catch (error) {
    logger.error(error);
  }

  return promptOutput;
}

export function responseToReadable(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) {
    return new Readable();
  }

  return new Readable({
    async read() {
      const result = await reader.read();
      if (!result.done) {
        this.push(Buffer.from(result.value));
      } else {
        this.push(null);
        return;
      }
    },
  });
}
/**
 * Classe utilitária apenas com propósito de facilitar logging de processamento em stream
 */
export class AtomicCounter {
  private _successCount = 0;
  private _totalCount = 0;
  private _failureCount = 0;

  public get totalCount() {
    return this._totalCount;
  }
  public get successCount() {
    return this._successCount;
  }
  public get failureCount() {
    return this._failureCount;
  }

  incrementSuccess() {
    this._successCount += 1;
  }

  increment() {
    this._totalCount += 1;
  }

  incrementFailure() {
    this._failureCount += 1;
  }
}
