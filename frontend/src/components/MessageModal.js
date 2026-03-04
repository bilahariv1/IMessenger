import React from 'react';

function MessageModal({ message, onClose }) {
    return ( <
        div className = "modal show d-block"
        tabIndex = "-1" >
        <
        div className = "modal-dialog" >
        <
        div className = "modal-content" >
        <
        div className = "modal-header" >
        <
        h5 className = "modal-title" > Message from { message.name } < /h5> <
        button type = "button"
        className = "btn-close"
        onClick = { onClose } > < /button> <
        /div> <
        div className = "modal-body" >
        <
        p > < strong > From: < /strong> {message.from}</p >
        <
        p > < strong > Timestamp: < /strong> {new Date(message.timestamp).toLocaleString()}</p >
        <
        hr / >
        <
        p > { message.message } < /p> <
        /div> <
        /div> <
        /div> <
        /div>
    );
}

export default MessageModal;