class Content extends React.Component {
    render() {
        return (
            <div className="content">
                <ContactProfile selectedChat={this.props.selectedChat} />
                <Messages selectedChat={this.props.selectedChat} />
                <MessageInput selectedChat={this.props.selectedChat}/>
            </div>
        );
    }
}