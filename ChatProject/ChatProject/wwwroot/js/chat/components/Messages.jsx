class Messages extends React.Component {
    render() {
        let messages = this.props.messages.map(msg => (
            <Message markedMessage={this.props.markedMessages.indexOf(msg.messageId) !== -1} markingMessage={this.props.markingMessage} id={msg.messageId} key={msg.messageId} attachments={msg.attachments} src={"/images/" + msg.image} sent={msg.isMine}>
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