import React from 'react';
import MessageList from './components/MessageList';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';

function App() {
    if (window.location.pathname === '/privacy-policy') {
        return <PrivacyPolicyPage />;
    }

    return ( <
        div >
        <
        MessageList / >
        <
        /div>
    );
}

export default App;