declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN_SECRET: string;
            MYSQL_HOST: string;
            MYSQL_PORT: string;
            MYSQL_PASSWORD: string;
            MYSQL_DB_NAME: string;
            MYSQL_USER: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
        }
    }
}

export {}
