class Chat extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedChat: window.location.hash.slice(1),
            chatHistory: [],
            search: '',
            chatInfo: {
                image: 'avatars/default.jpg',
                title: '',
                group: false,
                status: 1,
                creator: false,
                participants: []
            },
            _conversations: []
        };

        connection.invoke("GetConversations").then(conversations => {
            if (conversations !== null && conversations.length > 0) {
                this.setState({
                    _conversations: conversations
                });
                if (this.state.selectedChat === '') {
                    this.handleChatChange(conversations[0].guid);
                }
            }
        }).catch(reason => {
            console.error('onRejected function called: ' + reason);
        });

        connection.on("ReceiveMessage", this.handleGetMessage.bind(this));
        connection.on("ReceiveClosedChat", this.handleClosedChat.bind(this));
        connection.on("ReceiveChangeTitle", this.handleChangeTitle.bind(this));
        connection.on("ReceiveCreateChat", this.handleCreateChat.bind(this));
    }

    componentWillMount() {
        if (this.state.selectedChat.length > 0)
            this.updateData(this.state.selectedChat);
    }

    handleDeleteParticipant(guid) {
        if (this.state.chatInfo.participants[guid] === undefined) return false;
        let chatInfo = this.state.chatInfo;
        delete chatInfo.participants[guid];
        this.setState({ chatInfo: chatInfo });
    }

    handleClosedChat(guid) {
        if (guid === this.state.selectedChat) {
            let chatInfo = this.state.chatInfo;
            chatInfo.status = 1;
            this.setState({ chatInfo });
        }
    }

    handleCreateChat(conversation) {
        let conversations = this.state._conversations;
        conversations.push(conversation);
        this.setState({ _conversations: conversations });
    }

    handleChangeTitle(title, guid) {
        if (guid === this.state.selectedChat) {
            let chatInfo = this.state.chatInfo;
            chatInfo.title = title;
            this.setState({ chatInfo });
        }

        let conversations = this.state._conversations;
        let conversation = conversations.filter(conv => conv.guid === guid);
        if (conversation.length > 0) {
            conversation[0].title = title;
            this.setState({ _conversations: conversations });
        }
    }

    handleChatChange(guid) {
        this.updateData(guid);
        this.setState({
            selectedChat: guid
        });
        window.location.hash = guid;
    }

    handleGetMessage(message) {
        if (message.conversation === this.state.selectedChat) {
            let messages = this.state.chatHistory;
            messages.push(message);
            this.setState({ chatHistory: messages });
        }

        var conversations = this.state._conversations;
        var conversation = conversations.filter(conv => conv.guid === message.conversation);
        if (conversation.length > 0) {
            conversation[0].text = (message.isMine ? "You: " : "") + message.text;
            this.setState({ _conversations: conversations });
        }
    }

    handleChangeSearch(search) {
        this.setState({ search });
    }

    handleLeaveChat() {
        var conversations = this.state._conversations.filter(conv => conv.guid !== this.state.selectedChat);
        this.setState({ _conversations: conversations });

        if (conversations.length > 0)
            this.handleChatChange(conversations[0].guid);
        else
            this.handleChatChange('');

    }

    updateData(guid) {
        if (guid) {
            connection.invoke("GetHistoryConversation", guid).then(historyConversation => {
                this.setState({
                    chatHistory: historyConversation.messages,
                    chatInfo: {
                        image: historyConversation.image,
                        title: historyConversation.title,
                        group: historyConversation.group,
                        status: historyConversation.status,
                        creator: historyConversation.creator,
                        participants: historyConversation.participants
                    }
                });
            }).catch(reason => {
                console.error("There isn'n chat! Reason: " + reason);
            });
        }
        else {
            this.setState({
                chatHistory: [],
                chatInfo: {
                    image: 'avatars/default.jpg',
                    title: '',
                    group: false,
                    status: 1,
                    creator: false,
                    participants: []
                }
            });
        }
    }

    render() {
        return (
            <div className="wrapper_chat">
                <div id="frame">
                    <Sidepanel conversations={this.state._conversations}                        
                        
                        textSearch={this.state.search}
                        changeSearch={this.handleChangeSearch.bind(this)}

                        chatInfo={this.state.chatInfo}
                        deleteParticipant={this.handleDeleteParticipant.bind(this)}
                        leaveChat={this.handleLeaveChat.bind(this)}

                        changeChat={this.handleChatChange.bind(this)}
                        selectedChat={this.state.selectedChat} />

                    <Content chatInfo={this.state.chatInfo} chatHistory={this.state.chatHistory} selectedChat={this.state.selectedChat} />
                </div>
            </div>
        );
    }
}

connection.start().then(() => {
    ReactDOM.render(<Chat />, document.getElementById("chat"));
});