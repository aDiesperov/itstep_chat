class MessageInput extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: ''
        };
    }

    handleTextChange(e) {
        this.setState({
            text: e.target.value
        });
    }    

    handleBtnClick() {
        this.newMessage();
    }

    handleKeyPress(e) {
        if (e.which === 13) {
            this.newMessage();
        }
    }

    newMessage() {
        var { text } = this.state;
        if ($.trim(text) === '') {
            return false;
        }
        
        if (this.props.selectedChat === '') {
            return false;
        }

        connection.invoke("SendMessage", text, this.props.selectedChat);

        this.setState({ text: '' });
    }

    render() {
        return (
            <div className="message-input">
                <div className="wrap">
                    <input value={this.state.text} onChange={this.handleTextChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} type="text" placeholder="Write your message..." />
                    <i className="fa fa-paperclip attachment" aria-hidden="true" />
                    <button onClick={this.handleBtnClick.bind(this)} className="submit"><i className="fa fa-paper-plane" aria-hidden="true" /></button>
                </div>
            </div>
        );
    }
}