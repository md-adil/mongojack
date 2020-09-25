import { MongoError } from "mongodb";
export declare class Error extends MongoError {
    type: string;
}
export declare class ConnectionError extends Error {
}
export declare class ValidationError extends Error {
}
//# sourceMappingURL=error.d.ts.map