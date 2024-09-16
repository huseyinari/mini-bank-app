import React, { useEffect, useState } from "react";
import { Form, ButtonToolbar, Button, Loader, Placeholder, Table } from 'rsuite';
import RequiredSpan from "../components/RequiredSpan";
import axios from "axios";
import apiConstant from "../constant/api.json";
import { showFailAlert } from "../util/AlertUtil";
import { AccountUpdateRequest } from "../models/request/AccountUpdateRequest";
import { useNavigate, useParams } from "react-router-dom";
import { AccountDetailResponse } from "../models/response/AccountDetailResponse";
import { BankAppResponseBody } from "../models/BankAppResponseBody";
import { getTurkishString } from "../util/DateUtil";
import { TransactionHistoryResponse } from "../models/response/TransactionHistoryResponse";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { AccountSearchResponse } from "../models/response/AccountSearchResponse";
import SortUpIcon from '@rsuite/icons/SortUp';
import SortDownIcon from '@rsuite/icons/SortDown';
import { TransactionStatus } from "../models/enums/TransactionStatus";
import { useSelector } from "react-redux";

interface EditAccountPageProps {

}

const EditAccountPage: React.FC<EditAccountPageProps> = ({

}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [transactionTableLoading, setTransactionTableLoading] = useState<boolean>(false);
    const [accountData, setAccountData] = useState<AccountDetailResponse>(new AccountDetailResponse());
    const [accountUpdateRequest, setAccountUpdateRequest] = useState<AccountUpdateRequest>(new AccountUpdateRequest());
    const [transactionHistoryList, setTransactionHistoryList] = useState<TransactionHistoryResponse[]>([]);
    
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        jwtToken
    } = useSelector((state: any) => ({
        jwtToken: state.authReducer.jwtToken
    }))

    useEffect(() => {
        getAccountData(id);
        getAccountTransactions(id)
    }, [])

    const getAccountData = (id?: string) => {
        setLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.get(`${apiConstant.API_URL}/accounts/${id}`, { headers })
            .then(response => {
                if (response.status == 200) {
                    const responseBody = response.data as BankAppResponseBody<AccountDetailResponse>;
                    const data = responseBody.data;
                    setAccountData(data);
                    setAccountUpdateRequest({ name: data.name })
                }
            })
            .catch(error => {
                const errors: string[] = error.response?.data?.errors as string[];
                showFailAlert('Hata', errors);
            })
            .finally(() => setLoading(false))
    }

    const getAccountTransactions = (id?: string) => {
        setTransactionTableLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.get(`${apiConstant.API_URL}/transactions/account/${id}`, { headers })
            .then(response => {
                if (response.status == 200) {
                    const responseBody = response.data as BankAppResponseBody<TransactionHistoryResponse[]>;
                    const historyList = responseBody.data;

                    setTransactionHistoryList(historyList);
                }
            })
            .catch(error => {
                const errors: string[] = error.response?.data?.errors as string[];
                showFailAlert('Hata', errors);
            })
            .finally(() => setTransactionTableLoading(false))
    }

    const handleFormSubmit = () => {
        setLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.put(`${apiConstant.API_URL}/accounts/${id}`, accountUpdateRequest, {headers})
            .then(response => {
                if (response.status == 200) {
                    navigate('/accounts');
                }
            })
            .catch(error => {
                const errors: string[] = error.response?.data?.errors as string[];
                showFailAlert('Hata', errors);
            })
            .finally(() => setLoading(false))
    }

    const renderLoading = () => (
        <div>
            <Placeholder.Paragraph rows={8} />
            <Loader backdrop content="Güncelleniyor..." vertical />
        </div>
    )

    const TransactionDateCell = (props: any) => {
        const rowData = props.rowData;
        const dataKey = props.dataKey;

        return (
          <Cell {...props}>
            {getTurkishString(rowData[dataKey])}
          </Cell>
        );
    };
    const AmountCell = (props: any) => {
        const rowData = props.rowData;
        const dataKey = props.dataKey;

        return (
          <Cell {...props}>
            {`${rowData[dataKey]} ₺`}
          </Cell>
        );
    };
    const TransactionTypeCell = (props: any) => {
        const rowData = props.rowData;

        const toAccount = rowData['toAccount'] as AccountSearchResponse;
        const increasingTransaction = toAccount.id === id; // eğer transfer bu hesaba gerçekleştiye Para Girişi değilse Para Çıkışıdır.

        return (
          <Cell {...props}>
            {
                increasingTransaction
                ? <> <SortUpIcon color="green" /> <span style={{ color: 'green' }}>Para Girişi</span> </>
                : <> <SortDownIcon color="red" /> <span style={{ color: 'red' }}>Para Çıkışı</span> </>
            }
          </Cell>
        );
    };
    const AccountCell = (props: any) => {
        const rowData = props.rowData;

        const toAccount = rowData['toAccount'] as AccountSearchResponse;
        const fromAccount = rowData['fromAccount'] as AccountSearchResponse;
        const transactionAccountNumber = toAccount.id === id ? fromAccount.number : toAccount.number; // Karşı hesabın numarası
        
        return (
          <Cell {...props}>
            { transactionAccountNumber }
          </Cell>
        );
    };
    const StatusCell = (props: any) => {
        const rowData = props.rowData;
        const dataKey = props.dataKey;
        
        const enumKey = rowData[dataKey] as keyof typeof TransactionStatus;
        return (
          <Cell {...props}>
            {`${TransactionStatus[enumKey]}`}
          </Cell>
        );
    };
    
    const renderForm = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 30 }}>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="name">
                    <Form.ControlLabel>
                        Hesap Adı
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="name" 
                        required
                        value={accountUpdateRequest?.name || ''}
                        onChange={name => setAccountUpdateRequest({ ...accountUpdateRequest, name })} 
                    />
                </Form.Group>
                <Form.Group controlId="number">
                    <Form.ControlLabel>
                        Hesap Numarası
                    </Form.ControlLabel>
                    <Form.Control 
                        name="number"
                        value={accountData.number}
                        disabled
                    />
                </Form.Group>
                <Form.Group controlId="balance">
                    <Form.ControlLabel>
                        Bakiye
                    </Form.ControlLabel>
                    <Form.Control 
                        name="balance"
                        value={`${accountData.balance} ₺`}
                        disabled
                    />
                </Form.Group>
                <Form.Group controlId="createdAt">
                    <Form.ControlLabel>
                        Oluşturma Tarihi
                    </Form.ControlLabel>
                    <Form.Control 
                        name="createdAt"
                        value={getTurkishString(accountData.createdAt || '')}
                        disabled
                    />
                </Form.Group>
                <Form.Group controlId="updatedAt">
                    <Form.ControlLabel>
                        Güncelleme Tarihi
                    </Form.ControlLabel>
                    <Form.Control 
                        name="updatedAt"
                        value={getTurkishString(accountData.updatedAt || '')}
                        disabled
                    />
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" color="green" type="submit">Güncelle</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
            <h5 style={{ marginTop: 50 }}>Hesap Hareketleri</h5>
            <Table
                loading={transactionTableLoading} 
                height={400} 
                width={700} 
                data={transactionHistoryList} 
                renderLoading={renderLoading} 
                locale={{ emptyMessage: 'Sonuç bulunamadı.' }}
                style={{ marginTop: 30 }}
            >
                <>
                    <Column key='edit' flexGrow={2}>
                        <HeaderCell>Tarih</HeaderCell>
                        <TransactionDateCell dataKey="transactionDate"/>
                    </Column>
                    <Column key='edit' flexGrow={2}>
                        <HeaderCell>Hesap Numarası</HeaderCell>
                        <AccountCell />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Miktar</HeaderCell>
                        <AmountCell dataKey="amount" />
                    </Column>
                    <Column flexGrow={2}>
                        <HeaderCell>Tür</HeaderCell>
                        <TransactionTypeCell />
                    </Column>
                    <Column flexGrow={2}>
                        <HeaderCell>Durum</HeaderCell>
                        <StatusCell dataKey="status" />
                    </Column>
                </>
            </Table>
        </div>
    )

    return loading ? renderLoading() : renderForm();
}

export default EditAccountPage;