import React from "react";

interface HomePageProps {

}

const HomePage: React.FC<HomePageProps> = ({

}) => {
    return (
        <div style={{ width: '100vw', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h2>Hüseyin Arı Mini Bank Application</h2>
        </div>
    )
}

export default HomePage;