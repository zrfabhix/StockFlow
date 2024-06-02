class ApiResponse {
  statusCode;
  message;
  data;

  constructor(statusCode=200, data , message="success" ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;