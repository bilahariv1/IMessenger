class Message {
    constructor({ id, from, name, message, timestamp, label }) {
        this.id = id;
        this.from = from;
        this.name = name;
        this.message = message;
        this.timestamp = timestamp;
        this.label = label || '';
    }
}

export default Message;