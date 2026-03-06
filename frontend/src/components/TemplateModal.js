import React, { useState } from 'react';
import { sendTemplate } from '../api';

function TemplateModal({ message, onClose }) {
    const [templateName, setTemplateName] = useState('jaspers_market_order_confirmation_v1');
    const [param1, setParam1] = useState('');
    const [param2, setParam2] = useState('');
    const [param3, setParam3] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setResult('');
        console.log('i am in handleSubmit');
        try {
            const parameters = [param1, param2, param3].filter(p => p.trim() !== '');
            const response = await sendTemplate(message._id, templateName, parameters);

            setResult('Template message sent successfully via WhatsApp!');
            setTimeout(onClose, 2000);
        } catch (error) {
            setResult(`Failed to send template: ${error.response?.data?.message || error.message}`);
        }

        setLoading(false);
    };

    return ( <
        div className = "modal show d-block"
        tabIndex = "-1" >
        <
        div className = "modal-dialog modal-lg" >
        <
        form className = "modal-content"
        onSubmit = { handleSubmit } >
        <
        div className = "modal-header" >
        <
        h5 className = "modal-title" > Send WhatsApp Template to { message.name } < /h5> <
        button type = "button"
        className = "btn-close"
        onClick = { onClose } > < /button> < /
        div >

        <
        div className = "modal-body" >
        <
        div className = "mb-3" >
        <
        label className = "form-label" > Template Name < /label> <
        select className = "form-select"
        value = { templateName }
        onChange = {
            (e) => setTemplateName(e.target.value)
        }
        required >
        <
        option value = "jaspers_market_order_confirmation_v1" >
        Order Confirmation <
        /option> < /
        select > <
        small className = "text-muted" >
        Template: jaspers_market_order_confirmation_v1 <
        /small> < /
        div >

        <
        div className = "mb-3" >
        <
        label className = "form-label" > Customer Name < /label> <
        input type = "text"
        className = "form-control"
        value = { param1 }
        onChange = {
            (e) => setParam1(e.target.value)
        }
        placeholder = "e.g., John Doe"
        required /
        >
        <
        /div>

        <
        div className = "mb-3" >
        <
        label className = "form-label" > Order Number < /label> <
        input type = "text"
        className = "form-control"
        value = { param2 }
        onChange = {
            (e) => setParam2(e.target.value)
        }
        placeholder = "e.g., 123456"
        required /
        >
        <
        /div>

        <
        div className = "mb-3" >
        <
        label className = "form-label" > Delivery Date < /label> <
        input type = "text"
        className = "form-control"
        value = { param3 }
        onChange = {
            (e) => setParam3(e.target.value)
        }
        placeholder = "e.g., Mar 4, 2026"
        required /
        >
        <
        /div>

        {
            result && ( <
                div className = { `alert ${result.includes('success') ? 'alert-success' : 'alert-danger'} mt-3` } > { result } <
                /div>
            )
        } <
        /div>

        <
        div className = "modal-footer" >
        <
        button className = "btn btn-secondary"
        onClick = { onClose }
        type = "button" >
        Cancel <
        /button> <
        button className = "btn btn-primary"
        type = "submit"
        disabled = { loading } > { loading ? 'Sending...' : 'Send Template via WhatsApp' } <
        /button> < /
        div > <
        /form> < /
        div > <
        /div>
    );
}

export default TemplateModal;