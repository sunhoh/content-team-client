export enum Path {
  HOME = '/',
  AHTH = '/auth',
  DASHBOARD = '/dashboard',
  WORKS = '/works',
  SETTING = '/setting',
  AGENTS = '/agents',
  REPORT = '/report',
}
  
  export enum SubPath {
    CREATE = '/create',
    UPDATE = '/update',
  }
  
  export const PAGES: Record<string, string> = {
    
  };
  
  export enum QueryParams {
    ID = 'id',
    TAB = 'tab',
    TYPE = 'type',
    STATUS = 'status',
  }

  export enum WorkTab {
    STATUS = 'status',
    REPORT = 'report',
  }
  