class ModalSettings extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title: ''
        }
    }

    componentWillReceiveProps(next) {
        this.setState({ title: next.chatInfo.title });
    }

    handleSave() {
        if (this.state.title === '') return;

        if (this.props.chatInfo.creator && this.props.chatInfo.group) {
            connection.invoke("ChangeTitleConversation", this.props.selectedChat, this.state.title).then(res => {
                if (res) {
                    alert("Remaned");
                    this.refs.close.click();
                }
                else {
                    alert("Didn't rename");
                }
            })
        }
    }

    handleChangeTitle(e) {
        this.setState({ title: e.target.value });
    }

    handleDeleteConversation() {
        var guid = this.props.selectedChat;
        if (guid) {
            connection.invoke("DeleteConversation", guid).then(res => {
                if (res) {
                    alert("Deleted!");
                    this.refs.close.click();
                }
                else {
                    alert("Didn't delete!");
                }
            })
        }
    }

    handleLeaveConversation() {
        var guid = this.props.selectedChat;
        if (guid) {
            connection.invoke("LeaveConversation", guid).then(res => {
                if (res) {
                    alert("Leaved!");
                    this.props.leaveChat();
                    this.refs.close.click();
                }
                else {
                    alert("Didn't delete!");
                }
            })
        }
    }

    handleDeleteParticipant(guidUser) {
        return () => {
            var guidConversation = this.props.selectedChat;
            if (guidConversation && guidUser) {
                connection.invoke("DeleteParticipant", guidUser, guidConversation).then(res => {
                    if (res) {
                        alert("Deleted!");
                        this.props.deleteParticipant(guidUser);
                    }
                    else {
                        alert("Didn't delete!");
                    }
                })
            }
        }
    }

    render() {
        let deleteConversation = this.props.chatInfo.creator && this.props.chatInfo.status === 0 ? (<div className="form-group">
            <button className="btn btn-danger" onClick={this.handleDeleteConversation.bind(this)}>Close this conversation</button>
        </div>) : null;

        let title = this.props.chatInfo.creator && this.props.chatInfo.group ? (<div className="form-group">
            <label className="h4">Title:</label>
            <input value={this.state.title} className="form-control" onChange={this.handleChangeTitle.bind(this)} />
        </div>) : null;
        
        let participants = [];
        if (this.props.chatInfo.creator && this.props.chatInfo.participants !== null) {
            for (let guid in this.props.chatInfo.participants) {
                participants.push(
                    <div key={guid} className="form-group">
                        <div className="row">
                            <div className="col-xs-10">
                                <input readOnly value={this.props.chatInfo.participants[guid]} className="form-control" />
                            </div>
                            <div className="col-xs-2">
                                <button onClick={this.handleDeleteParticipant(guid)} className="btn btn-danger "><i className="glyphicon glyphicon-minus"></i></button>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        return (
            <div className="modal fade" id="settingsModal" tabIndex="-1" role="dialog" aria-labelledby="settingsModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title" id="myModalLabel">Create conversation</h4>
                        </div>
                        <div className="modal-body">
                            {title}
                            {participants.length > 0 ? < h4 > Participants</h4> : null}
                            {participants}
                            <div className="form-group">
                                <button className="btn btn-danger" onClick={this.handleLeaveConversation.bind(this)}>Leave from this conversation</button>
                            </div>
                            {deleteConversation}                            
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.handleSave.bind(this)} type="button" className="btn btn-success">Save</button>
                            <button ref="close" type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}