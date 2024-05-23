declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      TZ?: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_DATABASE_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DATABASE_URL: string;
      SECRET_KEY: string;
      HOST: string;
      PORT: string;
      CSV_IMPORTER_USE_IA_TO_PREDICT_SUPPLY_CATEGORIES: boolean;
      GEMINI_API_KEY?: string;
    }
  }
}

export {};
