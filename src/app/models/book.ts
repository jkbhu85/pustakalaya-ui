export enum BookInstanceStatus {
  ISSUED = 'ISSUED',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  REMOVED = 'REMOVED'
}

export interface BookCategory {
  id: number;
  name: string;
}
