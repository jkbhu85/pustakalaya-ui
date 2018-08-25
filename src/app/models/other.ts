/**
 * Represents a locale as received from the API call.
 */
export interface PtkLocale {
  id: number;
  name: string;
}

/**
 * Represents structure of a country.
 */
export interface Country {
  id: number;
  name: string;
  isdCode: string;
  abbr: string;
}

export interface Currency {
  id: number;
  code: string;
  description: string;
}

/**
 * Represents login status.
 */
export class LoginStatus {
  status: boolean;
}
