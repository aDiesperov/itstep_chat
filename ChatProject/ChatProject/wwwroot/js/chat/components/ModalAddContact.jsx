class ModalAddContact extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            _options: [],
            _participants: [''],
            _title: ''
        };

        connection.invoke("GetAllUsers").then(users => {
            this.setState({ _options: users });
        })
    }

    handleAddList() {
        let participants = this.state._participants;
        participants.push('');
        this.setState({ _participants: participants });
    }

    handleRemoveList(id) {
        let participants = this.state._participants;
        participants.splice(id, 1);
        this.setState({ _participants: participants });
    }

    handleChangeText(index, e) {
        let participants = this.state._participants;
        participants[index] = e.target.value;
        this.setState({ _participants: participants });
    }

    handleChangeTextTitle(e) {
        this.setState({ _title: e.target.value });
    }

    handleCreate() {
        let participants = this.state._participants;
        if (participants.length === 0) {
            console.log("Paricipants are empty!");
            return;
        }

        if (this.state._title.length === 0) {
            if (participants.length === 1 && participants[0].length > 4) {
                //ok - It's one to one chat
                this.CreateConversation()
            }
            else alert("Error! Title or participant's empty!");
        }
        else{
            for (let i = 0; i < participants.length; i++) {
                if (participants[i].length < 5) return false;
                for (let j = 0; j < participants.length; j++) {
                    if (i === j) continue;
                    if (participants[i] === participants[j]) {
                        alert("You can add any user once!");
                        return;
                    }
                }
            }
            this.CreateConversation();
        }
    }

    CreateConversation() {
        connection.invoke("CreateConversation", this.state._title, this.state._participants).then(msg => {
            if (msg) {
                alert("Created!");
                this.refs.close.click();
            }
            else {
                alert("Not created! You have error!");
            }
        });
    }

    render() {
        let options = this.state._options.map((option, index) => <option key={option + index} value={option} />);

        let inputs = this.state._participants.map((part, index) => (
            <div key={index} className="form-group">
                <div className="row">
                    <div className="col-xs-10">
                        <input onChange={this.handleChangeText.bind(this, index)} value={part} className="form-control" list="listParticipant" />
                    </div>
                    {this.state._participants.length !== 1 ? (
                    <div className="col-xs-2">
                        <button onClick={this.handleRemoveList.bind(this, index)} className="btn btn-danger "><i className="glyphicon glyphicon-minus"></i></button>
                    </div>
                    ) : null}
                </div>
            </div>
        ))

        return (
            <div className="modal fade" id="addContactModal" tabIndex="-1" role="dialog" aria-labelledby="addContactModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title" id="myModalLabel">Create conversation</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="h4">Title: </label>
                                <input onChange={this.handleChangeTextTitle.bind(this)} value={this.state._title} className="form-control" />
                            </div>
                            <h4>Participants:</h4>
                            {inputs}
                            <datalist id="listParticipant">{options}</datalist>
                            <button onClick={this.handleAddList.bind(this)} className="btn btn-success"> <i className="glyphicon glyphicon-plus" /> </button>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.handleCreate.bind(this)} type="button" className="btn btn-success">Create</button>
                            <button ref="close" type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}