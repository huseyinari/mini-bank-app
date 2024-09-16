export class BankAppResponseBody<T> {
    data!: T;
    errors?: Array<string>;
    responseTime?: string;
}