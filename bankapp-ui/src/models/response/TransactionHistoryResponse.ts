import { TransactionStatus } from "../enums/TransactionStatus";
import { AccountSearchResponse } from "./AccountSearchResponse";

export class TransactionHistoryResponse {
    id?: string;
    from?: AccountSearchResponse;
    to?: AccountSearchResponse;
    amount?: number;
    transactionDate?: string;
    status?: TransactionStatus;
}