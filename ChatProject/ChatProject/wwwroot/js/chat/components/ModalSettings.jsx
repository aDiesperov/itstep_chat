class ModalSettings extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            _options: [],
            newParticipant: '',
            title: ''
        }

        connection.invoke("GetAllUsers").then(users => {
            this.setState({ _options: users });
        })
    }

    componentWillReceiveProps(next) {
        this.setState({ title: next.chatInfo.title });
    }

    handleSaveTitle() {
        if (this.state.title === '') return;

        if (this.props.chatInfo.creator && this.props.chatInfo.group) {
            connection.invoke("ChangeTitleConversation", this.props.selectedChat, this.state.title).then(res => {
                if (res) {
                    alert("Remaned");
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
                    alert("Closed!");
                    this.refs.close.click();
                }
                else {
                    alert("Didn't close!");
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

    handleChangeNewParticipant(e) {
        this.setState({ newParticipant: e.target.value })
    }

    handleAddParticipant() {
        var guidConversation = this.props.selectedChat;
        if (guidConversation && this.state.newParticipant) {

            let xhr = new XMLHttpRequest();

            xhr.open("POST", "/api/chat/AddParticipant/" + guidConversation);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    alert("Added!");
                    this.props.addParticipant();
                    this.setState({ newParticipant: '' });
                }
                else if (xhr.readyState === 4) {
                    alert("Didn't added!");
                }
            }

            let formData = new FormData();
            formData.append("name", this.state.newParticipant);

            xhr.send(formData);
        }
    }

    render() {
        let deleteConversation = null;
        let options = null;

        let title = null;
        let participants = [];

        //It's for creator
        if (this.props.chatInfo.creator) {
            //Title and options
            if (this.props.chatInfo.group) {
                title = (<div className="form-group">
                    <label className="h4">Title:</label>
                    <div className="row">
                        <div className="col-xs-10">
                            <input value={this.state.title} className="form-control" onChange={this.handleChangeTitle.bind(this)} />
                        </div>
                        <div className="col-xs-2">
                            <button onClick={this.handleSaveTitle.bind(this)} className="btn btn-success"><i className="glyphicon glyphicon-refresh" /></button>
                        </div>
                    </div>
                </div>);

                options = this.state._options.map((option, index) => <option key={option + index} value={option} />);
            }

            //Delete conversation
            if (this.props.chatInfo.status === 0) {
                deleteConversation = (<div className="form-group">
                    <button className="btn btn-danger" onClick={this.handleDeleteConversation.bind(this)}>Close this conversation</button>
                </div>);
            }
        }

        //Participants
        if (this.props.chatInfo.participants !== null) {
            for (let guid in this.props.chatInfo.participants) {
                participants.push(
                    <div key={guid} className="form-group">
                        <div className="row">
                            <div className="col-xs-10">
                                <input readOnly value={this.props.chatInfo.participants[guid]} className="form-control" />
                            </div>
                            {this.props.chatInfo.creator ? (
                                <div className="col-xs-2">
                                    <button onClick={this.handleDeleteParticipant(guid)} className="btn btn-danger "><i className="glyphicon glyphicon-minus"></i></button>
                                </div>) : null}
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
                            {participants.length > 0 ? <h4>Participants</h4> : null}
                            {participants}
                            {(this.props.chatInfo.creator && this.props.chatInfo.group) ? (
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-xs-10">
                                            <input value={this.state.newParticipant} onChange={this.handleChangeNewParticipant.bind(this)} className="form-control" list="listParticipant" />
                                            <datalist id="listParticipant">{options}</datalist>
                                        </div>
                                        <div className="col-xs-2">
                                            <button onClick={this.handleAddParticipant.bind(this)} className="btn btn-success "><i className="glyphicon glyphicon-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <div className="form-group">
                                <button className="btn btn-danger" onClick={this.handleLeaveConversation.bind(this)}>Leave from this conversation</button>
                            </div>
                            {deleteConversation}
                        </div>
                        <div className="modal-footer">
                            <button ref="close" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}