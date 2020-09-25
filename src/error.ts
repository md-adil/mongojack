import { MongoError } from "mongodb";
export class Error extends MongoError {
  type = "MongoModelError";
}

export class ConnectionError extends Error {}

export class ValidationError extends Error {}
