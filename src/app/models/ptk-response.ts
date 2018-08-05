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
  VALUE_TOO_LARGE = 31,

  /**
   * Code 32.
   */
  VALUE_TOO_SMALL_OR_EMPTY = 32,

  /**
   * Code 33.
   */
  INVALID_FORMAT = 33,

  /**
   * Code 34.
   */
  UNSUPPORTED_VALUE = 34,

  /**
   * Code 35.
   */
  VALUE_ALREADY_EXIST = 35,

  /**
   * Code 36.
   */
  RESOURCE_HAS_EXPIRED = 36,

  /**
   * Code 37.
   */
  EMPTY_FILE = 37,

  /**
   * Code 38.
   */
  MAIL_NOT_SENT_INVALID_EMAIL = 38,

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
