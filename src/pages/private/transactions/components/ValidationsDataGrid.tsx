import type { TransactionsType } from "src/contexts/interfaces/transactions.interfaces";

interface ValidationData {
  id?: string | number;
  userId?: string;
  userEmail?: string | undefined;
  description?: string;
  date?: string;
  amount?: string;
  observation?: string;
}

const specialCharacters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'-]+$/;

// export const validateUserIdFn =
//   (rows: TransactionsType[]) => async (data: ValidationData) => {
//     const { id, userId } = data;
//     if (!userId) return `El id de usuario es obligatorio.`;
//     return null;
//   };

export const validateUserIdFn =
  (rows: TransactionsType[]) => async (data: ValidationData) => {
    const { id, userId } = data;
    return null;
  };

  export const validateUserEmailFn =
  (rows: TransactionsType[]) => async (data: ValidationData) => {
    //const { id, observation } = data;
    return null;
  };

export const validateDescriptionFn =
  (rows: TransactionsType[]) => async (data: ValidationData) => {
    const { id, description } = data;
    if (!description) return `La descripción es obligatorio.`;
    return null;
  };

export const validateDateFn =
  (rows: TransactionsType[]) => async (data: ValidationData) => {
    const { id, date } = data;
    if (!date) return `La fecha es obligatoria.`;
    return null;
  };

export const validateAmountFn =
  (rows: TransactionsType[]) => async (data: ValidationData) => {
    const { id, amount } = data;
    if (!amount) return `El monto es obligatoria.`;
    return null;
  };

// export const validateMeansOfPaymentFn = (rows: UserType[]) => async (data: ValidationData) => {
//   const { id, meansOfPayment } = data;
//   if (!meansOfPayment) return `El medio de pago es obligatorio.`;

export const validateObservationFn =
  (rows: TransactionsType[]) => async (data: ValidationData) => {
    //const { id, observation } = data;
    return null;
  };

// export const validateAreaFn = (rows: UserType[]) => async (data: ValidationData) => {
//   const { id, area } = data;
//   if (!area) return `El area es obligatoria.`;

//   return null;
//};

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return 'Formato de email inválido.';
//   }
//   const existingEmails = rows
//     .filter((row) => (id ? row.id !== id : true))
//     .map((row) => row.email?.toLowerCase());
//   const exists = email ? existingEmails.includes(email.toLowerCase()) : false;
//   return exists ? `El email ${email} ya existe.` : null;
// };

// export const validatePasswordFn = (rows: UserType[]) => async (data: ValidationData) => {
//   const { id, password } = data;
//   if (!password) return null;
//   if (password.length < 8) return `El password debe ser mayor a 8 caracteres.`;
//   if (password.length > 50) return `El password debe ser menor a 50 caracteres.`;
//   if (/\s/.test(password)) return 'El password no puede contener espacios';
//   const passwordValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
//   if (!passwordValidate.test(password)) {
//     return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
//   }
//   return null;
//};
