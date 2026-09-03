export declare namespace Mclogs {
    namespace Logs {
        namespace v1 {
            type CreateResponse = {
                success: boolean;
                id: string;
                source: string | null;
                created: number;
                expires: number;
                size: number;
                lines: number;
                errors: number;
                url: string;
                raw: string;
                token: string;
            };
        }
    }
}
