export enum UserRole {
    ADMIN = 'ADMIN',
    LIBRARIAN = 'LIBRARIAN',
    MEMBER = 'MEMBER',
    NONE = 'NONE'
}

export enum UserAcStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    REVOKED = 'REVOKED',
    LOCKED = 'LOCKED',
    INCOMPLETE = 'INCOMPLETE'
}

export enum Gender {
    MALE = 'M',
    FEMALE = 'F',
    OTHER = 'O'
}

export enum BookInstanceStatus {
    ISSUED = 'ISSUED',
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
    REMOVED = 'REMOVED'
}

export class Country {
    id: number;
    name: string;
    isdCode: string;
    abbr: string;

    constructor(id?: number, name?: string, isdCode?: string, abbr?: string) {
        this.id = id;
        this.name = name;
        this.isdCode = isdCode;
        this.abbr = abbr;
    }
}


export class User {
    id: number;
}

export class Address {
    addrId: number;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pin: string;
    country: string;
}

export class UserInfo {
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
 * Wraps a boolean.
 */
export class LoginStatus {
    status: boolean;
}
