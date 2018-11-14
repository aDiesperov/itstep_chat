class Content extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            markedMessages: []
        };
    }

    componentWillReceiveProps(next) {
        if (next.selectedChat !== this.props.selectedChat)
            this.setState({ markedMessages: [] });
    }

    handleMarkingMessage(id) {
        if (this.props.selectedChat === '') return;

        let { markedMessages } = this.state;
        let index = markedMessages.indexOf(id);
        if (index === -1)
            markedMessages.push(id);
        else
            markedMessages.splice(index, 1);
        this.setState({ markedMessages });
    }

    handleUnmarkingAllMessages() {
        if (this.props.selectedChat === '') return;

        this.setState({ markedMessages: [] });
    }

    handleDeletingMessages() {
        if (this.props.selectedChat === '') return;
        if (this.state.markedMessages.length === 0) return;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/chat/DeleteMessages/" + this.props.selectedChat);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.response === 'true') {
                    this.setState({ markedMessages: [] });
                }
                else {
                    alert("Didn't delete");
                }
            }
            else if (xhr.readyState === 4) {
                console.error("Warning");
            }
        };

        let formData = new FormData();

        this.state.markedMessages.forEach(msg => 
            formData.append("msgs", msg));

        xhr.send(formData);
    }

    render() {
        return (
            <div className="content">
                <ContactProfile unmarkingAllMessages={this.handleUnmarkingAllMessages.bind(this)} deletingMessages={this.handleDeletingMessages.bind(this)} markedMessages={this.state.markedMessages.length > 0} image={this.props.chatInfo.image} title={this.props.chatInfo.title} />
                <Messages markedMessages={this.state.markedMessages} markingMessage={this.handleMarkingMessage.bind(this)} messages={this.props.chatHistory} />
                <MessageInput status={this.props.chatInfo.status} selectedChat={this.props.selectedChat} />
            </div>
        );
    }
}