export enum BookInstanceStatus {
  ISSUED = 'ISSUED',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  REMOVED = 'REMOVED'
}

export enum BookCategory {
  TEXT_BOOK = 'TEXT_BOOK',
  MAGAZINE = 'MAGAZINE'
}

export interface BookCategoryObj {
  id: number;
  name: string;
}

export interface BookInstance {
  id: string;
  title: string;
  authors: string;

  numOfPages: string;
  publication: string;
  volume: string;
  edition: string;
  isbn: string;

  status: BookInstanceStatus;
  bookCategory: BookCategory;

  addedOn: string;
  comments: string;
}
