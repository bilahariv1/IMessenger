import React, { useState, useEffect } from 'react';
import { fetchMessages } from '../api';
import MessageModal from './MessageModal';
import ReplyModal from './ReplyModal';
import TemplateModal from './TemplateModal';

function MessageList() {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMsg, setOpenMsg] = useState(null);
    const [replyMsg, setReplyMsg] = useState(null);
    const [templateMsg, setTemplateMsg] = useState(null);
    const [bulkReply, setBulkReply] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchMessages().then(setMessages).finally(() => setLoading(false));
    }, []);

    const filtered = messages.filter(
        m =>
        m.from.includes(search) ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.label && m.label.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSelect = id => {
        setSelected(selected =>
            selected.includes(id) ?
            selected.filter(s => s !== id) : [...selected, id]
        );
    };

    return ( <
        div className = "container mt-4" >
        <
        h2 > WhatsApp Messages < /h2> <
        input className = "form-control mb-2"
        placeholder = "Search by phone or name"
        value = { search }
        onChange = { e => setSearch(e.target.value) }
        /> {
            loading ? ( <
                div className = "spinner-border" / >
            ) : ( <
                form >
                <
                table className = "table table-bordered" >
                <
                thead >
                <
                tr >
                <
                th >
                <
                input type = "checkbox"
                checked = { selected.length === filtered.length && filtered.length > 0 }
                onChange = {
                    e =>
                    setSelected(
                        e.target.checked ? filtered.map(m => m.id) : []
                    )
                }
                /> <
                /th> <
                th > From < /th> <
                th > Name < /th> <
                th > Label < /th> <
                th > Message < /th> <
                th > Replies < /th> <
                th > Timestamp < /th> <
                th > Actions < /th> <
                /tr> <
                /thead> <
                tbody > {
                    filtered.map(msg => ( <
                        tr key = { msg.id } >
                        <
                        td >
                        <
                        input type = "checkbox"
                        checked = { selected.includes(msg.id) }
                        onChange = {
                            () => handleSelect(msg.id) }
                        /> <
                        /td> <
                        td > { msg.from } < /td> <
                        td > { msg.name } < /td> <
                        td > { msg.label } < /td> <
                        td > { msg.message.slice(0, 30) }... < /td> <
                        td >
                        {
                            msg.replies && msg.replies.length > 0 ? (
                                <div>
                                    <span className="badge bg-primary me-2">
                                        {msg.replies.length} {msg.replies.length === 1 ? 'Reply' : 'Replies'}
                                    </span>
                                    <div className="small">
                                        {msg.replies.map((reply, idx) => (
                                            <div key={idx} className="mb-1">
                                                <span className={`badge ${
                                                    reply.status === 'sent' ? 'bg-success' :
                                                    reply.status === 'failed' ? 'bg-danger' : 'bg-warning'
                                                }`}>
                                                    {reply.status}
                                                </span>
                                                <span className="ms-1 text-muted">
                                                    {reply.text?.slice(0, 20) || reply.templateName}
                                                    {reply.text?.length > 20 ? '...' : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-muted">No replies</span>
                            )
                        }
                        </td> <
                        td > { new Date(msg.timestamp).toLocaleString() } < /td> <
                        td >
                        <
                        button type = "button"
                        className = "btn btn-link"
                        onClick = {
                            () => setOpenMsg(msg) } >
                        Open <
                        /button> <
                        button type = "button"
                        className = "btn btn-primary btn-sm ms-2"
                        onClick = {
                            () => setReplyMsg(msg) } >
                        Reply <
                        /button> <
                        button type = "button"
                        className = "btn btn-success btn-sm ms-2"
                        onClick = {
                            () => setTemplateMsg(msg) } >
                        Template <
                        /button> <
                        /td> <
                        /tr>
                    ))
                } <
                /tbody> <
                /table> {
                    selected.length > 1 && ( <
                        button type = "button"
                        className = "btn btn-success"
                        onClick = {
                            () => setBulkReply(true) } >
                        Bulk Reply <
                        /button>
                    )
                } <
                /form>
            )
        } {
            openMsg && ( <
                MessageModal message = { openMsg }
                onClose = {
                    () => setOpenMsg(null) }
                />
            )
        } {
            replyMsg && ( <
                ReplyModal message = { replyMsg }
                onClose = {
                    () => setReplyMsg(null) }
                bulk = { false }
                />
            )
        } {
            templateMsg && ( <
                TemplateModal message = { templateMsg }
                onClose = {
                    () => setTemplateMsg(null) }
                />
            )
        } {
            bulkReply && ( <
                ReplyModal message = { messages.filter(m => selected.includes(m.id)) }
                onClose = {
                    () => setBulkReply(false) }
                bulk = { true }
                />
            )
        } <
        /div>
    );
}

export default MessageList;