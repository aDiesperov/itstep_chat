class Contacts extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            _conversations: []
        };

        connection.invoke("GetConversations").then(conversations => {
            if (conversations !== null && conversations.length > 0) {
                this.setState({
                    _conversations: conversations
                });
                if (this.props.selectedChat === '') {
                    this.props.changeChat(conversations[0].guid);
                }
            }            
        }).catch(reason => {
            console.error('onRejected function called: ' + reason);
            });
        connection.on("ReceiveMessage", this.handleTakeMessage.bind(this));
    }

    handleChangeChat = (guid) => () => this.props.changeChat(guid);

    handleTakeMessage(message) {
        var conversations = this.state._conversations;
        var conversation = conversations.filter(conv => conv.guid === message.conversation);
        if (conversation.length > 0) {
            conversation[0].text = (message.isMe ? "You: " : "") + message.text;
        }
        this.setState({ _conversations: conversations });
    }

    render() {

        let conversations = this.state._conversations.map(conversation => (
            <Contact onClick={this.handleChangeChat(conversation.guid)} key={conversation.guid} conversation={conversation.guid}
                active={conversation.guid === this.props.selectedChat}
                src={"/images/"+conversation.image}
                name={conversation.title}>
                {conversation.text}
            </Contact>
        ));

        return (
            <div id="contacts" className={this.props.expand ? "expanded" : ""}>
                <ul>
                    {conversations}
                </ul>
            </div>
        );
    }
}