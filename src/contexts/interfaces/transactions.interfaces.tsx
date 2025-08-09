// Tipos para las acciones
export enum ActionTransactionEnum {
  get = 'get',
  getByTerm = 'getByTerm',
  add = 'add',
  edit = 'edit',
  delete = 'delete',
}

export type ActionTransactionTypes = {
  (action: ActionTransactionEnum.get): Promise<TransactionsType[] | undefined>;
  (action: ActionTransactionEnum.getByTerm, id: string): Promise<TransactionsType | undefined>;
  (action: ActionTransactionEnum.add | ActionTransactionEnum.edit, data: TransactionsType): Promise<TransactionsType | ApiErrorType | undefined>;
  (action: ActionTransactionEnum.delete , id: string): Promise<void>;  // Es void porque no retorna nada el delete
};

export enum CategoryEnum {
  IMPUESTOS = 'IMPUESTOS',
  COMIDA = 'COMIDA',
  TRANSPORTE = 'TRASPORTE',
  VIVIENDA = 'VIVIENDA',
  ESTUDIOS = 'ESTUDIOS',
  DEPORTES = 'DEPORTES',
  OCIO = 'OCIO',
  SERVICIO = 'SERVICIO',
  VARIOS = 'VARIOS',
}

export enum MeansOfPaymentEnum {
  EFECTIVO = 'EFECTIVO',
  DEVITO = 'DEVITO',
  CREDITO = 'CREDITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  CHEQUE = 'CHEQUE',
  OTROS = 'OTROS',
}

export enum AreaEnum {
  ADMINISTRACION = 'ADMINISTRACIÓN',
  COMPRAS = 'COMPRAS',
  VENTAS = 'VENTAS',
  OTROS = 'OTROS',
}

// Interface para el usuario
export interface TransactionsType {
  id?: string;
  userId?: string;
  description?: string;
  date?: String;
  amount?: number;
  category?: CategoryEnum;
  meansOfPayment?: MeansOfPaymentEnum;
  observation?: string;  // Agrego "Activo" e "Inactivo" como tipo porque eso es lo que retorna el formulario.
  area?: AreaEnum;
  isActive: true,
  isNew?: boolean | "Activo" | "Inactivo";
}

export interface ApiErrorType {
  message: string;
  error: string;
  statusCode: number;
}

// Interface para tipar el contexto
export interface TransactionsContextType {
  getTransactions: () => Promise<void>;
  transactions: TransactionsType[] | null;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionsType[] | null>>;
  actionTransaction: <T = any>(action: ActionTransactionEnum, data?: any, id?: string) => Promise<T | undefined>;
  categories: CategoryEnum[], 
  meansOfPayment: MeansOfPaymentEnum[], 
  areas: AreaEnum[],
  loading: boolean;
  error: string | null;
}