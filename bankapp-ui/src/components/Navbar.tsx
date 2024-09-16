import React, { useEffect } from "react";
import { Navbar, Nav } from "rsuite";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ExitIcon from '@rsuite/icons/Exit';
import { logoutAction } from "../redux/slices/authSlice";

interface BankAppNavbarProps {

}

const BankAppNavbar: React.FC<BankAppNavbarProps> = ({

}) => { 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        isLoggedIn
    } = useSelector((state: any) => ({
        isLoggedIn: state.authReducer.isLoggedIn
    }))

    useEffect(() => {
        console.log("isLoggedIn", isLoggedIn);
    })

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate('/login');
    }

    return (
        <Navbar>
            <Navbar.Brand onClick={() => navigate('/')}>Anasayfa</Navbar.Brand>
            <Nav>
                {
                    isLoggedIn === false
                    &&
                    <>
                        <Nav.Item onClick={() => navigate('/register')}>Kayıt Ol</Nav.Item>
                        <Nav.Item onClick={() => navigate('/login')}>Giriş Yap</Nav.Item>
                    </>
                }
                {
                    isLoggedIn === true
                    &&
                    <>
                        <Nav.Item onClick={() => navigate('/accounts')}>Hesaplarım</Nav.Item>
                        <Nav.Item onClick={() => navigate('/transfer')}>Para Transferi</Nav.Item>
                    </>
                }
            </Nav>
            {
                isLoggedIn === true
                &&
                <Nav pullRight>
                    <Nav.Item icon={<ExitIcon />} onClick={() => handleLogout()}>Çıkış Yap</Nav.Item>
                </Nav>
            }
        </Navbar>
    )
}

export default BankAppNavbar;