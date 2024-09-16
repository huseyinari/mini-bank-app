import React, { useState } from "react";
import { Form, ButtonToolbar, Button } from 'rsuite';
import { UserRegisterRequest } from "../models/request/UserRegisterRequest";
import apiConstant from "../constant/api.json";
import axios from "axios";
import { showFailAlert } from "../util/AlertUtil";
import { createSearchParams, useNavigate } from "react-router-dom";
import RequiredSpan from "../components/RequiredSpan";

interface RegisterPageProps {

}

const RegisterPage: React.FC<RegisterPageProps> = ({

}) => {
    const navigate = useNavigate();
    const [registerRequest, setRegisterRequest] = useState<UserRegisterRequest>(new UserRegisterRequest());

    const handleFormSubmit = () => {
        if (registerRequest.password !== registerRequest.rePassword) {
            showFailAlert('Hata', ['Parolalar birbiriyle eşleşmiyor.']);
            return;
        }

        axios.post(`${apiConstant.API_URL}/users/register`, registerRequest)
            .then(response => {
                if (response.status === 201) {
                    navigate({
                        pathname: '/login',
                        search: createSearchParams({ from: 'register' }).toString()
                    })
                }
            })
            .catch(error => {
                const errors: string[] = error.response?.data?.errors as string[];
                showFailAlert('Hata', errors);
            })

        
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="username">
                    <Form.ControlLabel>
                        Kullanıcı Adı 
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="username" 
                        required 
                        onChange={username => setRegisterRequest({...registerRequest, username})} 
                    />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.ControlLabel>
                        Email 
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="email" 
                        type="email" 
                        required 
                        onChange={email => setRegisterRequest({...registerRequest, email})}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.ControlLabel>
                        Parola 
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="password" 
                        type="password" 
                        autoComplete="off" 
                        required 
                        onChange={password => setRegisterRequest({...registerRequest, password})}
                    />
                </Form.Group>
                <Form.Group controlId="re-password">
                    <Form.ControlLabel>
                        Parola (Tekrar) 
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="re-password" 
                        type="password" 
                        autoComplete="off" 
                        required 
                        onChange={rePassword => setRegisterRequest({...registerRequest, rePassword})}
                    />
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" type="submit">Kayıt Ol</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    )
}

export default RegisterPage;