class Sidepanel extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            expand: false
        };
    }

    handleExpandChange() {
        this.setState({ expand: !this.state.expand });
    }

    render() {
        return (
            <div id="sidepanel">
                <Profile expand={this.state.expand} onClick={this.handleExpandChange.bind(this)} />
                <Search changeSearch={this.props.changeSearch} />

                <Contacts conversations={this.props.conversations}

                    textSearch={this.props.textSearch}

                    changeChat={this.props.changeChat}
                    selectedChat={this.props.selectedChat}

                    expand={this.state.expand} />

                <BottomBar chatInfo={this.props.chatInfo}
                    deleteParticipant={this.props.deleteParticipant}
                    leaveChat={this.props.leaveChat}
                    
                    selectedChat={this.props.selectedChat} />
            </div>
        );
    }
}