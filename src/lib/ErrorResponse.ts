class ErrorResponse extends Error {
  private statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  getStatusCode() {
    return this.statusCode;
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }

  setMessage(message: string) {
    super.message = message;
  }

  getMessage() {
    return super.message;
  }
}

export { ErrorResponse };
