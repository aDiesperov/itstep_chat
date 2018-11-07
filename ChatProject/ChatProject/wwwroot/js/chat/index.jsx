class Chat extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedChat: window.location.hash.slice(1)
        };
    }

    handleChatChange(guid) {
        this.setState({
            selectedChat: guid
        });
        window.location.hash = guid;
    }

    render() {
        return (
            <div className="wrapper_chat">
                <div id="frame">
                    <Sidepanel changeChat={this.handleChatChange.bind(this)} selectedChat={this.state.selectedChat} />
                    <Content selectedChat={this.state.selectedChat} />
                </div>
            </div>
        );
    }
}

connection.start().then(() => {
    ReactDOM.render(<Chat />, document.getElementById("chat"));
});