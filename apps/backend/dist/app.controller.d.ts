export declare class AppController {
    getHello(): {
        message: string;
        version: string;
        description: string;
        endpoints: string[];
    };
    getHealth(): {
        status: string;
        timestamp: string;
    };
}
