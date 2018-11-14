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
        connection.on("ReceiveCreatedChat", this.handleCreatedChat.bind(this));
        connection.on("ReceiveDeletedMessages", this.handleDeletedMessages.bind(this));
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

    handleAddParticipant() {
        this.updateData(this.state.selectedChat);
    }

    handleClosedChat(guid) {
        if (guid === this.state.selectedChat) {
            let chatInfo = this.state.chatInfo;
            chatInfo.status = 1;
            this.setState({ chatInfo });
        }
    }

    handleCreatedChat(conversation) {
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

        if (message.isMine) $(".messages").animate({ scrollTop: $(".messages ul").height() }, "fast");
    }

    handleDeletedMessages(deletedMessages) {
        if (deletedMessages.conversation === this.state.selectedChat) {
            let messages = this.state.chatHistory;
            messages = messages.filter(msg => deletedMessages.messagesIds.indexOf(msg.messageId) === -1);
            this.setState({ chatHistory: messages });
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
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/chat/" + guid);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let chatInfoAll = JSON.parse(xhr.response);
                    this.setState({
                        chatHistory: chatInfoAll.messages,
                        chatInfo: {
                            image: chatInfoAll.image,
                            title: chatInfoAll.title,
                            group: chatInfoAll.group,
                            status: chatInfoAll.status,
                            creator: chatInfoAll.creator,
                            participants: chatInfoAll.participants
                        }
                    });
                    $(".messages").ready(
                        $(".messages").animate({ scrollTop: $(".messages ul").height() }, "fast")
                    );
                }
                else if (xhr.readyState === 4) {
                    console.error("Conversation is warning");
                }
            };

            xhr.send();
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
            <div id="frame">
                <Sidepanel conversations={this.state._conversations}

                    textSearch={this.state.search}
                    changeSearch={this.handleChangeSearch.bind(this)}

                    chatInfo={this.state.chatInfo}
                    deleteParticipant={this.handleDeleteParticipant.bind(this)}
                    addParticipant={this.handleAddParticipant.bind(this)}
                    leaveChat={this.handleLeaveChat.bind(this)}

                    changeChat={this.handleChatChange.bind(this)}
                    selectedChat={this.state.selectedChat} />

                <Content chatInfo={this.state.chatInfo} chatHistory={this.state.chatHistory} selectedChat={this.state.selectedChat} />
            </div>
        );
    }
}

connection.start().then(() => {
    ReactDOM.render(<Chat />, document.getElementById("chat"));
});