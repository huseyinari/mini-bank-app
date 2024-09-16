import React, { useEffect, useState } from "react";
import { Form, ButtonToolbar, Button, Loader, Placeholder } from 'rsuite';
import RequiredSpan from "../components/RequiredSpan";
import axios from "axios";
import apiConstant from "../constant/api.json";
import { showFailAlert } from "../util/AlertUtil";
import { TransferMoneyRequest } from "../models/request/TransferMoneyRequest";
import { useNavigate } from "react-router-dom";
import { BankAppResponseBody } from "../models/BankAppResponseBody";
import { AccountSearchResponse } from "../models/response/AccountSearchResponse";
import { SelectPicker } from 'rsuite';
import { useSelector } from "react-redux";

interface TransferMoneyPageProps {

}

const TransferMoneyPage: React.FC<TransferMoneyPageProps> = ({

}) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [transferMoneyRequest, setTransferMoneyRequest] = useState<TransferMoneyRequest>(new TransferMoneyRequest());
    const [accounts, setAccounts] = useState<AccountSearchResponse[]>([]);

    const {
        jwtToken
    } = useSelector((state: any) => ({
        jwtToken: state.authReducer.jwtToken
    }))

    useEffect(() => {
        getAccounts();
    }, [])

    const handleFormSubmit = () => {
        setLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.post(`${apiConstant.API_URL}/transactions/transfer`, transferMoneyRequest, {headers})
            .then(response => {
                if (response.status == 201) {
                    navigate('/accounts')
                }
            })
            .catch(error => {
                const errors: string[] = error.response?.data?.errors as string[];
                showFailAlert('Hata', errors);
            })
            .finally(() => setLoading(false))
    }

    const getAccounts = () => {
        setLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.get(`${apiConstant.API_URL}/accounts`, { headers })
            .then(response => {
                if (response.status == 200) {
                    const responseBody = response.data as BankAppResponseBody<AccountSearchResponse[]>;
                    setAccounts(responseBody.data || []);
                }
            })
            .catch(error => {
                const errors: string[] = error.response?.data?.errors as string[];
                showFailAlert('Hata', errors);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const renderLoading = () => (
        <div>
            <Placeholder.Paragraph rows={8} />
            <Loader backdrop content="Kaydediliyor..." vertical />
        </div>
    )
    
    const renderForm = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 30 }}>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="fromAccountNumber">
                    <Form.ControlLabel>
                        İşlem Yapılacak Hesabınız
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <SelectPicker
                        data={accounts}
                        labelKey="name"
                        valueKey="number"
                        value={transferMoneyRequest.fromAccountNumber}
                        searchable={false}
                        style={{ width: 300 }}
                        onChange={fromAccountNumber => setTransferMoneyRequest({...transferMoneyRequest, fromAccountNumber: fromAccountNumber || ''})}
                        placeholder="Seçiniz"
                    />
                </Form.Group>
                <Form.Group controlId="toAccountNumber">
                    <Form.ControlLabel>
                        Hesap Numarası
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="toAccountNumber" 
                        required
                        maxLength={15}
                        value={transferMoneyRequest?.toAccountNumber || ''}
                        onChange={toAccountNumber => setTransferMoneyRequest({ ...transferMoneyRequest, toAccountNumber })} 
                    />
                </Form.Group>
                <Form.Group controlId="name">
                    <Form.ControlLabel>
                        Miktar
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="amount" 
                        required
                        min={0}
                        type="number"
                        value={transferMoneyRequest?.amount}
                        onChange={amount => setTransferMoneyRequest({ ...transferMoneyRequest, amount })} 
                    />
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" color="green" type="submit">Para Transferi Gerçekleştir</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    )

    return loading ? renderLoading() : renderForm();
}

export default TransferMoneyPage;