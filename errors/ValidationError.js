class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Validation Error';
    this.status = 400;
  }
}

module.exports = ValidationError;
