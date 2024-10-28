declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT_WS: string;
        }
    }
}

export {};
