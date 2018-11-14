class BottomBar extends React.Component {

    render() {
        return (
            <div id="bottom-bar">
                
                <button data-toggle="modal" data-target="#addContactModal"><i className="fa fa-user-plus fa-fw" aria-hidden="true" /> <span>Add contact</span></button>
                <button data-toggle="modal" data-target="#settingsModal"><i className="fa fa-cog fa-fw" aria-hidden="true" /> <span>Settings</span></button>
                <ModalAddContact />
                <ModalSettings deleteParticipant={this.props.deleteParticipant}
                    addParticipant={this.props.addParticipant}
                    leaveChat={this.props.leaveChat}
                    chatInfo={this.props.chatInfo}
                    selectedChat={this.props.selectedChat} />
            </div>
            );
    }
}