import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Placeholder, Input, Button } from 'rsuite';
import apiConstant from "../constant/api.json";
import { BankAppResponseBody } from "../models/BankAppResponseBody";
import { AccountSearchResponse } from "../models/response/AccountSearchResponse";
import { showFailAlert } from "../util/AlertUtil";
import { AccountSearchRequest } from "../models/request/AccountSearchRequest";
import { useNavigate } from "react-router-dom";
import { getTurkishString } from "../util/DateUtil";
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import { useSelector } from "react-redux";

const { Column, HeaderCell, Cell } = Table;

interface AccountsPageProps {

}

const AccountsPage: React.FC<AccountsPageProps> = ({

}) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<AccountSearchResponse[]>([]);
    const [accountSearchRequest, setAccountSearchRequest] = useState<AccountSearchRequest>(new AccountSearchRequest());

    const {
        jwtToken
    } = useSelector((state: any) => ({
        jwtToken: state.authReducer.jwtToken
    }))
    
    useEffect(() => {
        getAccounts(accountSearchRequest);
    }, [])

    const getAccounts = (params: AccountSearchRequest) => {
        setLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.get(`${apiConstant.API_URL}/accounts`, { headers, params })
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

    const columns = [
        {
          key: 'name',
          label: 'Hesap Adı',
          flexGrow: 4
        },
        {
          key: 'number',
          label: 'Hesap Numarası',
          flexGrow: 3
        }
    ];

    const renderLoading = () => (
        <div>
            <Placeholder.Grid rows={5} columns={3} active />
        </div>
    );

    const CreateAtCell = (props: any) => {
        const rowData = props.rowData;
        const dataKey = props.dataKey;

        return (
          <Cell {...props}>
            {getTurkishString(rowData[dataKey])}
          </Cell>
        );
    };
    const DetailCell = (props: any) => {
        const rowData = props.rowData;
        const dataKey = props.dataKey;

        const id = rowData[dataKey];
        return (
          <Cell {...props}>
            <ArrowRightLineIcon style={{ cursor: 'pointer' }} onClick={() => navigate(`/accounts/${id}`)} />
          </Cell>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 30 }}>
            <div style={{ display: 'flex', minWidth: 700 }}>
                <Input 
                    placeholder="Hesap Adı" 
                    onChange={name => setAccountSearchRequest({...accountSearchRequest, name})}
                />
                <Input 
                    placeholder="Hesap Numarası" 
                    style={{ marginLeft: 10 }}
                    onChange={number => setAccountSearchRequest({...accountSearchRequest, number})}
                />
                <Button 
                    appearance="primary" 
                    style={{ width: 150, marginLeft: 20 }}
                    onClick={() => {
                        getAccounts(accountSearchRequest);
                    }}
                >
                    Sorgula
                </Button>
                <Button 
                    appearance="primary"
                    color="green"
                    style={{ width: 200, marginLeft: 10 }}
                    onClick={() => {
                        navigate('/accounts/new')
                    }}
                >
                    Yeni Hesap
                </Button>
            </div>
            <Table 
                loading={loading} 
                height={400} 
                width={800} 
                data={accounts} 
                renderLoading={renderLoading} 
                locale={{ emptyMessage: 'Sonuç bulunamadı.' }}
                style={{ marginTop: 30 }}
            >
                <>
                    {
                        columns.map(column => {
                            const { key, label, ...rest } = column;
                            return (
                                <Column {...rest} key={key}>
                                    <HeaderCell>{label}</HeaderCell>
                                    <Cell dataKey={key} />
                                </Column>
                            );
                        })
                    }
                    <Column flexGrow={4}>
                        <HeaderCell>Oluşturma Tarihi</HeaderCell>
                        <CreateAtCell dataKey="createdAt" />
                    </Column>
                    <Column flexGrow={2}>
                        <HeaderCell>Detaya Git</HeaderCell>
                        <DetailCell dataKey="id" />
                    </Column>
                </>
            </Table>
        </div>
    )
}

export default AccountsPage;