class Content extends React.Component {

    render() {
        return (
            <div className="content">
                <ContactProfile image={this.props.chatInfo.image} title={this.props.chatInfo.title} />
                <Messages messages={this.props.chatHistory} />
                <MessageInput status={this.props.chatInfo.status} selectedChat={this.props.selectedChat} />
            </div>
        );
    }
}