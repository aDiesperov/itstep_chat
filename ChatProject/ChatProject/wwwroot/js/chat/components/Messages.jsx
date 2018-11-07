class Messages extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            _messages: []
        };

        connection.on("ReceiveMessage", this.handleTakeMessage.bind(this));

        this.updateData(this.props.selectedChat);
    }

    componentWillReceiveProps(next) {
        this.updateData(next.selectedChat);
    }
    componentDidUpdate() {
        console.dir(this.refs.messages);
        this.refs.messages.scrollTop = this.refs.messages.scrollHeight - this.refs.messages.clientHeight;
    }

    updateData(guid) {
        if (guid) {
            connection.invoke("GetMessages", guid).then(messages => {
                if (messages !== null && messages.length > 0) {
                    this.setState({ _messages: messages });
                }
            }).catch(reason => {
                console.error('onRejected function called: ' + reason);
            });
        }
    }

    handleTakeMessage(message) {
        let messages = this.state._messages;
        messages.push(message);
        this.setState({ _messages: messages });
    }

    render() {
        let messages = this.state._messages.map(msg => (
            <Message key={msg.messageId} src={"/images/" + msg.image} sent={msg.isMe}>
                {msg.text}
            </Message>
        ));

        return (
            <div ref="messages" className="messages">
                <ul>
                    {messages}
                </ul>
            </div>
        );
    }
}