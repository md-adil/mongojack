export class Error extends global.Error {
  code = "MongoModelError";
}

export class ConnectionError extends Error {}

export class ValidationError extends Error {}
