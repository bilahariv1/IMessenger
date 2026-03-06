import React from 'react';

function PrivacyPolicyPage() {
    return (
        <div style={{ maxWidth: '860px', margin: '32px auto', padding: '24px' }}>
            <h1>Privacy Policy</h1>
            <p><strong>Effective Date:</strong> March 6, 2026</p>

            <p>
                This Privacy Policy explains how IMessenger ("we", "our", or "us") collects,
                uses, stores, and protects personal information when you use our messaging services,
                including integrations with the WhatsApp Business Platform.
            </p>

            <h2>1. Information We Collect</h2>
            <ul>
                <li>Profile information shared through WhatsApp (for example, display name and phone number).</li>
                <li>Message content you send to our WhatsApp business account.</li>
                <li>Message metadata (message ID, delivery status, timestamps, and webhook event payloads).</li>
                <li>Technical logs required for security, debugging, and service reliability.</li>
            </ul>

            <h2>2. How We Use Information</h2>
            <ul>
                <li>To receive and respond to your messages.</li>
                <li>To provide customer support and operational communication.</li>
                <li>To monitor message delivery/read status and improve reliability.</li>
                <li>To maintain security, prevent abuse, and troubleshoot issues.</li>
            </ul>

            <h2>3. Data Deletion Requests</h2>
            <p>
                To request deletion of your data, email us with your WhatsApp number and request details at:
                <code> privacy@yourdomain.com</code>
            </p>
        </div>
    );
}

export default PrivacyPolicyPage;
