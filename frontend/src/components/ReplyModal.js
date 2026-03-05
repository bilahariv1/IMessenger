import React, { useState } from 'react';
import { replyMessage, replyBulk } from '../api';

function ReplyModal({ message, onClose, bulk }) {
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (bulk) {
                await replyBulk(message.map(m => m.id), replyText);
            } else {
                await replyMessage(message.id, replyText);
            }
            setSuccess('Reply sent via WhatsApp!');
            setTimeout(onClose, 1000);
        } catch {
            setSuccess('Failed to send reply');
        }
        setLoading(false);
    };

    return ( <
        div className = "modal show d-block"
        tabIndex = "-1" >
        <
        div className = "modal-dialog" >
        <
        form className = "modal-content"
        onSubmit = { handleSubmit } >
        <
        div className = "modal-header" >
        <
        h5 className = "modal-title" > { bulk ? 'Bulk Reply' : `Reply to ${message.name}` } <
        /h5> <
        button type = "button"
        className = "btn-close"
        onClick = { onClose } > < /button> <
        /div> <
        div className = "modal-body" >
        <
        textarea className = "form-control"
        rows = { 3 }
        value = { replyText }
        onChange = { e => setReplyText(e.target.value) }
        required placeholder = "Type your reply..." /
        > {
            success && < div className = "alert alert-info mt-2" > { success } < /div>} <
            /div> <
            div className = "modal-footer" >
            <
            button className = "btn btn-secondary"
            onClick = { onClose }
            type = "button" >
            Cancel <
            /button> <
            button className = "btn btn-primary"
            type = "submit"
            disabled = { loading } > { loading ? 'Sending...' : 'Send Reply via WhatsApp' } <
            /button> <
            /div> <
            /form> <
            /div> <
            /div>
        );
    }

    export default ReplyModal;