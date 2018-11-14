class MessageInput extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: '',
            files: null
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

    handleChangeFiles(e) {
        this.setState({ files: e.target.files });
    }

    newMessage() {
        var { text, files } = this.state;
        if ($.trim(text) === '' && files === null)
            return;

        if (this.props.selectedChat === '')
            return false;

        let formData = new FormData();

        if (files !== null)
            for (let file of files) {
                formData.append("files", file);
            }

        formData.append("text", text);
        formData.append("guid", this.props.selectedChat);

        let xhr = new XMLHttpRequest();

        xhr.open("POST", "api/chat/SendMessage");
        xhr.send(formData);

        this.setState({ text: '' });
        this.setState({ files: null });
    }

    render() {
        let input = this.props.status === 1 ? (
            <div className="wrap"><div className="closed-conversation">This conversation is close</div></div>
        ) : (
                <div className="wrap">
                    <input value={this.state.text} onChange={this.handleTextChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} type="text" placeholder="Write your message..." />
                    <label className="fa fa-paperclip attachment" aria-hidden="true">
                        <input type="file" onChange={this.handleChangeFiles.bind(this)} multiple style={{ display: "none" }} />
                    </label>
                    <button onClick={this.handleBtnClick.bind(this)} className="submit">
                        <i className="fa fa-paper-plane" aria-hidden="true" />
                    </button>
                </div>
            );

        return (
            <div className="message-input">

                {input}

            </div>
        );
    }
}