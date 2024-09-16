import React, { useState } from "react";
import { Form, ButtonToolbar, Button, Loader, Placeholder } from 'rsuite';
import RequiredSpan from "../components/RequiredSpan";
import { AccountCreateRequest } from "../models/request/AccountCreateRequest";
import axios from "axios";
import apiConstant from "../constant/api.json";
import { showFailAlert, showSuccessAlert } from "../util/AlertUtil";
import { useSelector } from "react-redux";

interface CreateAccountPageProps {

}

const CreateAccountPage: React.FC<CreateAccountPageProps> = ({

}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [accountCreateRequest, setAccountCreateRequest] = useState<AccountCreateRequest>(new AccountCreateRequest());

    const {
        jwtToken
    } = useSelector((state: any) => ({
        jwtToken: state.authReducer.jwtToken
    }))

    const handleFormSubmit = () => {
        setLoading(true);

        const headers = {'Authorization': `Bearer ${jwtToken}`};
        axios.post(`${apiConstant.API_URL}/accounts`, accountCreateRequest, {headers})
            .then(response => {
                if (response.status == 201) {
                    showSuccessAlert('Başarılı', 'Hesap başarıyla eklendi.');
                    setAccountCreateRequest(new AccountCreateRequest());
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
            <Loader backdrop content="Kaydediliyor..." vertical />
        </div>
    )
    
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
                        value={accountCreateRequest?.name || ''}
                        onChange={name => setAccountCreateRequest({ ...accountCreateRequest, name })} 
                    />
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" color="green" type="submit">Hesap Oluştur</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    )

    return loading ? renderLoading() : renderForm();
}

export default CreateAccountPage;