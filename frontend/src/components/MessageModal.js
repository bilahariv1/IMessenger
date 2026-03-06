import React from 'react';

function MessageModal({ message, onClose }) {
    return ( <
        div className = "modal show d-block"
        tabIndex = "-1" >
        <
        div className = "modal-dialog modal-lg" >
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
        p > { message.message } < /p>

        {
            message.replies && message.replies.length > 0 && ( <
                >
                <
                hr / >
                <
                h6 > Replies: < /h6> <
                ul className = "list-group" > {
                    message.replies.map((reply, index) => ( <
                        li key = { index }
                        className = "list-group-item" >
                        <
                        div >
                        <
                        strong > { reply.templateName ? `Template: ${reply.templateName}` : 'Text Reply' } <
                        /strong> {
                            reply.status && ( <
                                span className = { `badge ms-2 ${
                                                        reply.status === 'sent' ? 'bg-success' :
                                                        reply.status === 'failed' ? 'bg-danger' :
                                                        'bg-warning'
                                                    }` } > { reply.status } <
                                /span>
                            )
                        } <
                        /div> <
                        div className = "mt-2" > { reply.text } < /div> {
                            reply.whatsappMessageId && ( <
                                small className = "text-muted" > WhatsApp ID: { reply.whatsappMessageId } < /small>
                            )
                        } {
                            reply.parameters && reply.parameters.length > 0 && (
                                <div className="mt-1">
                                    <small className="text-muted">Parameters: {reply.parameters.join(', ')}</small>
                                </div>
                            )
                        } {
                            reply.whatsappApiResponse && (
                                <div className="mt-2">
                                    <details>
                                        <summary className="text-muted small" style={{cursor: 'pointer'}}>
                                            WhatsApp API Response
                                        </summary>
                                        <pre className="bg-light p-2 mt-1 small">
                                            {JSON.stringify(reply.whatsappApiResponse, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )
                        } {
                            reply.error && (
                                <div className = "alert alert-danger mt-2 mb-0" >
                                Error: { reply.error } <
                                /div>
                            )
                        } <
                        small className = "text-muted d-block mt-1" > { new Date(reply.timestamp).toLocaleString() } <
                        /small> <
                        /li>
                    ))
                } <
                /ul> <
                />
            )
        } <
        /div> <
        /div> <
        /div> <
        /div>
    );
}

export default MessageModal;