/**
 * Represents roles for user.
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
  MEMBER = 'MEMBER',
  NONE = 'NONE'
}

/**
 * Represents user's accout status.
 */
export enum UserAcStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  REVOKED = 'REVOKED',
  LOCKED = 'LOCKED',
  INCOMPLETE = 'INCOMPLETE'
}

/**
 * Represents user's gender.
 */
export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O'
}

export class AuthInfo {
  // fields below are as received from server
  /**
   * Unique identification for user.
   */
  id: number;

  /**
   * Name of user.
   */
  name: string;

  /**
   * Role held by user.
   */
  role: string;
  /**
   * Email id of user.
   */
  email: string;

  /**
   * Locale of user.
   */
  locale: string;

  /**
   * time at which token will expire.
   */
  exp: number;

  /**
   * time at which token was created.
   */
  iat: number;

  // fields below are added by application

  /**
   * Local time at which the token will expire.
   */
  localExp: number;
}

/**
 * Represents user's initital registration information.
 */
export interface RegistrationInfo {
  firstName: string;
  lastName: string;
  email: string;
  locale: string;
  expiresOn: number;
}

/**
 * Represents an address.
 */
export class Address {
  addrId: number;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
  country: string;
}
