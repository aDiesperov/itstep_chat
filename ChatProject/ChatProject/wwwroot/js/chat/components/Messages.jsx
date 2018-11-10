class Messages extends React.Component {

    componentDidUpdate() {
        this.refs.messages.scrollTop = this.refs.messages.scrollHeight - this.refs.messages.clientHeight;
    }

    render() {
        let messages = this.props.messages.map(msg => (
            <Message key={msg.messageId} src={"/images/" + msg.image} sent={msg.isMine}>
                {msg.text}
            </Message>
        ));

        return (
            <div ref="messages" className="messages">
                <ul className="list-unstyled">
                    {messages}
                </ul>
            </div>
        );
    }
}