import React from "react";
import BankAppNavbar from "../components/Navbar";


interface BankAppLayoutProps extends React.PropsWithChildren {

}

const BankAppLayout: React.FC<BankAppLayoutProps> = ({
    children
}) => (
    <>
        <BankAppNavbar />
        <main style={{ minHeight: '100vh', padding: 20 }}>
            { children }
        </main>
    </>
)

export default BankAppLayout;