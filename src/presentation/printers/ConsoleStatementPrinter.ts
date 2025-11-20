import { Transaction } from "../../domain/value-objects/Transaction";
import type { IStatementPrinter } from "./IStatementPrinter";

export class ConsoleStatementPrinter implements IStatementPrinter {
    public print(transactions: Transaction[]): void {
        const header = ["Date", "Amount", "Balance"];

        if (transactions.length === 0) {
            console.table([
                {
                    [header[0]!]: "",
                    [header[1]!]: "",
                    [header[2]!]: "",
                },
            ]);
            return;
        }

        const statementRows = [...transactions]
            .filter(Boolean)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((tx) => [
                tx.date.toISOString().split("T")[0],
                tx.amount.toFixed(2),
                tx.balance.toFixed(2),
            ]);

        const formattedForTable = statementRows.map((row) => ({
            [header[0]!]: row[0],
            [header[1]!]: row[1],
            [header[2]!]: row[2],
        }));

        console.table(formattedForTable);
    }
}
