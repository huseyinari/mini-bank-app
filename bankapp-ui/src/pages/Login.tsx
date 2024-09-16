import React, { useState } from "react";
import { Form, ButtonToolbar, Button } from 'rsuite';
import { Message } from 'rsuite';
import apiConstant from "../constant/api.json";
import axios from "axios";
import { showFailAlert } from "../util/AlertUtil";
import { useNavigate, useSearchParams } from "react-router-dom";
import RequiredSpan from "../components/RequiredSpan";
import { UserLoginRequest } from "../models/request/UserLoginRequest";
import { BankAppResponseBody } from "../models/BankAppResponseBody";
import { UserLoginResponse } from "../models/response/UserLoginResponse";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/slices/authSlice";

interface LoginPageProps {

}

const LoginPage: React.FC<LoginPageProps> = ({

}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const [loginRequest, setLoginRequest] = useState<UserLoginRequest>(new UserLoginRequest());
    const handleFormSubmit = () => {

        axios.post(`${apiConstant.API_URL}/users/login`, loginRequest)
            .then(response => {
                if (response.status === 200) {
                    const responseBody = response.data as BankAppResponseBody<UserLoginResponse>;
                    const jwtToken = responseBody.data?.token || '';

                    dispatch(loginAction(jwtToken));
                    navigate('/accounts')
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
                {
                    from === 'register'
                    &&
                    <Form.Group>
                        <Message type="success">
                            <strong>Kayıt Başarılı</strong> <br/>Sisteme giriş yapabilirsiniz.
                        </Message>
                    </Form.Group>
                }
                <Form.Group controlId="username">
                    <Form.ControlLabel>
                        Kullanıcı Adı 
                        <RequiredSpan />
                    </Form.ControlLabel>
                    <Form.Control 
                        name="username" 
                        required 
                        onChange={username => setLoginRequest({...loginRequest, username})} 
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
                        onChange={password => setLoginRequest({...loginRequest, password})}
                    />
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" color="green" type="submit">Giriş Yap</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginPage;