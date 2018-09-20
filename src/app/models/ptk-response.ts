export enum ResponseCode {
  // Successful operation
  /**
   * Code 10.
   */
  OPERATION_SUCCESSFUL = 10,

  // Security related
  /**
   * Code 21.
   */
  INVALID_CREDENTIALS = 21,

  /**
   * Code 22.
   */
  ACCOUNT_LOCKED = 22,

  /**
   * Code 23.
   */
  ACCOUNT_ACCESS_REVOKED = 23,

  /**
   * Code 24.
   */
  PASSWORD_DID_NOT_MATCH = 24,

  /**
   * Code 25.
   */
  SECURITY_ANSWER_DID_NOT_MATCH = 25,

  // Validation related

  /**
   * Code 31.
   */
  EMPTY_VALUE = 31,

  /**
   * Code 32.
   */
  VALUE_TOO_SMALL = 32,

  /**
   * Code 33.
   */
  VALUE_TOO_LARGE = 33,

  /**
   * Code 34.
   */
  LENGTH_TOO_SHORT = 34,

  /**
   * Code 35.
   */
  LENGTH_TOO_LONG = 35,

  /**
   * Code 36.
   */
  INVALID_FORMAT = 36,

  /**
   * Code 37.
   */
  UNSUPPORTED_VALUE = 37,

  /**
   * Code 38.
   */
  VALUE_ALREADY_EXIST = 38,

  /**
   * Code 39.
   */
  RESOURCE_HAS_EXPIRED = 39,

  /**
   * Code 40.
   */
  DOES_NOT_MATCH = 40,

  /**
   * Code 41.
   */
  MAIL_NOT_SENT_INVALID_EMAIL = 41,

  // System related
  /**
   * Code 51.
   */
  SYSTEM_UNAVAILABLE = 51,

  /**
   * Code 52.
   */
  MAIL_COULD_NOT_BE_SENT = 52,

  // Unsuccessful operations
  /**
   * Code 61.
   */
  OPERATION_UNSUCCESSFUL = 61,

  /**
   * Code 62.
   */
  LIMIT_EXCEEDED = 62,

  /**
   * Code 63.
   */
  RESOURCE_DOES_NOT_EXIST = 63,

  /**
   * Code 64.
   */
  UNKNOWN_ERROR = 64
}

export interface PtkResponse {
  responseCode?: ResponseCode;
  message?: string;
  errors?: any;
  data?: any;
}
