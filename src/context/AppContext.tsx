import { createContext, useContext, useState } from "react";
import { Transaction } from "../types";
import { useMediaQuery, useTheme } from "@mui/material";
import { Schema } from "../validations/schema";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { isFirestoreError } from "../utils/errorHandling";

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  //取引を保存する処理
  const onSaveTransaction = async (transaction: Schema) => {
    try {
      //firestoreにデータを保存
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (err) {
      if (isFirestoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  //削除処理
  const onDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];

      for (const id of idsToDelete) {
        //firestoreのデータ削除
        await deleteDoc(doc(db, "Transactions", id));
      }
      //複数の取引を削除可能
      const filterdTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
      );
      setTransactions(filterdTransactions);
    } catch (err) {
      if (isFirestoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  //更新処理
  const onUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      //firestore更新処理
      const docRef = doc(db, "Transactions", transactionId);

      await updateDoc(docRef, transaction);
      //フロント更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFirestoreError(err)) {
        console.error("firestoreのエラーは：", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onDeleteTransaction,
        onSaveTransaction,
        onUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    //contextがundefinedの場合の処理
    throw new Error("グローバルなデータはプロバイダーの中で取得してください。");
  }
  return context;
};
