import React from "react";
import { Grid, Paper } from "@mui/material";
import MonthSelector from "../components/MonthSelector";
import CategoryChart from "../components/CategoryChart";
import BarChart from "../components/BarChart";

import TransactionTable from "../components/TransactionTable";
import { Transaction } from "../types";

// interface ReportProps {
//   currentMonth: Date;
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   monthlyTransactions: Transaction[];
//   isLoading: boolean;
//   onDeleteTransaction: (
//     transactionId: string | readonly string[]
//   ) => Promise<void>;
// }

const Report = () =>
  //   {
  //   currentMonth,
  //   setCurrentMonth,
  //   monthlyTransactions,
  //   isLoading,
  //   onDeleteTransaction,
  // }: ReportProps

  {
    const commonPaperStyle = {
      height: "400px",
      display: "flex",
      flexDirection: "column",
      p: 2,
    };
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/*日付選択エリア */}
          <MonthSelector
          // currentMonth={currentMonth}
          // setCurrentMonth={setCurrentMonth}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {/*円グラフ */}
          <Paper sx={commonPaperStyle}>
            <CategoryChart
            // monthlyTransactions={monthlyTransactions}
            // isLoading={isLoading}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={commonPaperStyle}>
            {/*棒グラフ */}
            <BarChart
            // monthlyTransactions={monthlyTransactions}
            // isLoading={isLoading}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {/**テーブル */}
          <TransactionTable
          // monthlyTransactions={monthlyTransactions}
          // onDeleteTransaction={onDeleteTransaction}
          />
        </Grid>
      </Grid>
    );
  };

export default Report;
