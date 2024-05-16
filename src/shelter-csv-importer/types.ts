import { AtomicCounter } from './shelter-csv-importer.helpers';

import { Prisma } from '@prisma/client';
import { Readable } from 'node:stream';
import { CreateShelterSchema } from '../shelter/types/types';

type ShelterKey = Exclude<
  Prisma.ShelterScalarFieldEnum,
  'createdAt' | 'updatedAt' | 'prioritySum' | 'verified' | 'id'
>;

export type ShelterColumHeader = Record<`${ShelterKey}Field`, string> & {
  shelterSuppliesField: string;
};

interface ParseCsvArgsBaseArgs<T = Record<string, string>> {
  /**
   * link do arquivo CSV
   */
  csvUrl?: string;
  /**
   *  stream proveniente de algum arquivo CSV
   */
  fileStream?: Readable;
  /**
   * mapeamento de quais cabeçalhos do csv serão usados como colunas da tabela.
   */
  headers?: Partial<T>;
  /**
   * se true, não salvará nada no banco
   */
  dryRun?: boolean;
}

export type ParseCsvArgs<T> =
  | (ParseCsvArgsBaseArgs<T> & { csvUrl: string })
  | (ParseCsvArgsBaseArgs<T> & { fileStream: Readable });
export interface EnhancedTransformArgs {
  /**
   * KeyValue contento as categorias e os supplies contidos naquela categorias (detectados por IA)
   */
  shelterSupliesByCategory: Record<string, string[]>;
  /**
   * KeyValue com Suprimentos já encontrados na base atual que podem ser utilizadas em relações
   * @example
   * { "Óleo de cozinha": "eb1d5056-8b9b-455d-a179-172a747e3f20",
   *   "Álcool em gel": "a3e3bdf8-0be4-4bdc-a3b0-b40ba931be5f"
   *  }
   */
  suppliesAvailable: Map<string, string>;
  /**
   * KeyValue com Categorias já encontradas na base atual que podem ser utilizadas em relações
   * @example
   * { "Higiene Pessoal": "718d5be3-69c3-4216-97f1-12b690d0eb97",
   *   "Alimentos e Água": "a3e3bdf8-0be4-4bdc-a3b0-b40ba931be5f"
   *  }
   */
  categoriesAvailable: Map<string, string>;
  counter?: AtomicCounter;
}
export type ShelterInput = Partial<
  Prisma.ShelterCreateInput & { supplies: string[] }
>;

/**
 * Exemplo de Padrão utilizado:
 * `nome_do_local, endereco, whatsapp, lat, lng, itens_disponiveis, itens_em_falta`
 */
export const CSV_DEFAULT_HEADERS: ShelterColumHeader = {
  nameField: 'nome_do_local',
  addressField: 'endereco',
  contactField: 'whatsapp',
  latitudeField: 'lat',
  longitudeField: 'lng',
  shelterSuppliesField: 'itens_em_falta',
  capacityField: 'capacidade',
  cityField: 'cidade',
  neighbourhoodField: 'bairro',
  petFriendlyField: 'pet_friendly',
  pixField: 'pix',
  shelteredPeopleField: 'pessoas_abrigadas',
  streetField: 'rua',
  streetNumberField: 'numero',
  zipCodeField: 'cep',
};

/**
 *  Regex que ignora vírgulas dentro de parenteses no split
 */
export const COLON_REGEX = /(?<!\([^)]*),(?![^(]*\))/g;
export interface ShelterValidInput
  extends ReturnType<(typeof CreateShelterSchema)['parse']> {
  id?: string;
}
export type ShelterCsvImporterExecutionArgs =
  ParseCsvArgs<ShelterColumHeader> & {
    /**
     * Se deverá usar alguma LLM para tentar categorizar as categorias dos suprimentos
     * @implNote por enquanto apenas `Gemini` foi implementada.
     */
    useIAToPredictSupplyCategories?: boolean;
    /**
     *
     * callback executado após cada entidade ser criada ou ser validada (caso `dryRun` seja true)
     *
     * ** NÃO será executada caso `useBatchTransaction` seja true
     */
    onEntity?: (shelter: ShelterValidInput) => void;
    /**
     * Se true, guardará todas as criações em memória e executará elas em um batch `$transaction`
     *  [Prisma $transaction docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    useBatchTransaction?: boolean;
  };
