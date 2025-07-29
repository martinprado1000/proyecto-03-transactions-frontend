const URL_BACK = import.meta.env.VITE_URL_BACK;
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "./AuthUserContext";
import {
  ActionTransactionEnum,
  AreaEnum,
  CategoryEnum,
  MeansOfPaymentEnum,
  type ApiErrorType,
  type TransactionsContextType,
  type TransactionsType,
} from "./interfaces/transactions.interfaces";;

// Crear el contexto con tipo
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);
// Este es nuestro hook que exporta el contexto
export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (!context) {
    // Hacemos esta validacion para asegurar que los datos sangan del contexto
    throw new Error("useTransactionsContext must be used within a TransactionsProvider");
  }
  return context;
}

// Tipar las props del provider
interface TransactionsProviderPropsType {
  children: React.ReactNode;
}

const categories = [CategoryEnum.COMIDA, CategoryEnum.DEPORTES, CategoryEnum.ESTUDIOS, CategoryEnum.IMPUESTOS, CategoryEnum.OCIO, CategoryEnum.SERVICIO, CategoryEnum.TRANSPORTE, CategoryEnum.VARIOS, CategoryEnum.VIVIENDA];
const meansOfPayment = [MeansOfPaymentEnum.CHEQUE, MeansOfPaymentEnum.CREDITO, MeansOfPaymentEnum.DEVITO, MeansOfPaymentEnum.EFECTIVO, MeansOfPaymentEnum.OTROS, MeansOfPaymentEnum.TRANSFERENCIA]
const areas = [AreaEnum.ADMINISTRACION, AreaEnum.COMPRAS, AreaEnum.OTROS, AreaEnum.VENTAS]


// Provider
export function TransactionsProvider({ children }: TransactionsProviderPropsType) {
  const navigate = useNavigate();
  const { userAuth } = useAuthContext();
  const [transactions, setTransactions] = useState<TransactionsType[] | null>(null);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  const getTransactions = async () => {
    const resTransactions = await actionTransaction(ActionTransactionEnum.get);
    setTransactions(resTransactions);
    return;
  };

  const actionTransaction = async (
    action: ActionTransactionEnum,
    data?: TransactionsType,
    id?: string
  ): Promise<any> => {

    // Esta validacion no la hago porque se que existe userAuth gracias al protectedRoute.
    // if (!userAuth || !userAuth.token) {
    //   throw new Error("Usuario no autenticado o token faltante");
    // }

    let res: Response; // tipo Response: TypeScript sabe que es un objeto de respuesta que devuelve la API Fetch nativa del navegador. El tipo Response ya incluye todas las propiedades y métodos que necesitas, ejemplo .json

    try {
      switch (action) {
        case ActionTransactionEnum.get: {
          res = await fetch(`${URL_BACK}/api/transactions/?limit=100`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          break;
        }

        case ActionTransactionEnum.getByTerm: {
          res = await fetch(`${URL_BACK}/api/transactions/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          break;
        }

        case ActionTransactionEnum.add: {
          console.log(data)
          res = await fetch(`${URL_BACK}/api/transactions`, {
            method: "POST",
            //credentials: "include", // Permito que el backend cargue y elimine las cookie en el front
            headers: {
              Authorization: `Bearer ${userAuth!.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          console.log(res)
          break;
        }

        case ActionTransactionEnum.edit: {
          res = await fetch(`${URL_BACK}/api/transactions/${id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${userAuth!.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          break;
        }

        case ActionTransactionEnum.delete:
          {
            res = await fetch(`${URL_BACK}/api/transactions/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${userAuth!.token}`,
                "Content-Type": "application/json",
              },
            });
            if (res.status === 204) return;
          }
          break;

      }

      const responsBackend: TransactionsType | TransactionsType[] | ApiErrorType | undefined =
      await res.json();

      if (res.status == 401 && responsBackend && "message" in responsBackend) {
        // responsBackend && 'message' in responsBackend  hago esa parte de la validación para que type script sepa que es de tipo ApiError.
        // Si no esta autorizado elimino la cookie
        console.log(responsBackend.message);
        sessionStorage.removeItem("user");
        navigate("/sign-in");
      } else {
        return responsBackend;
      }
    } catch (error) {
      console.log(error);
      navigate("/fatalErrorPage");
    }
  };

  return (
    <TransactionsContext.Provider
      value={{ getTransactions, transactions, setTransactions, actionTransaction, categories, meansOfPayment, areas, loading, error }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
