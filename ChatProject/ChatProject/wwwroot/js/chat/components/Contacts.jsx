class Contacts extends React.Component {

    handleChangeChat = (guid) => () => this.props.changeChat(guid);

    render() {
        let conversations = this.props.conversations.map(conversation => conversation.title.toLowerCase().indexOf(this.props.textSearch.toLowerCase()) !== -1 ? (
            <Contact onClick={this.handleChangeChat(conversation.guid)} key={conversation.guid} conversation={conversation.guid}
                active={conversation.guid === this.props.selectedChat}
                src={"/images/"+conversation.image}
                name={conversation.title}>
                {conversation.text}
            </Contact>
        ) : null);

        return (
            <div id="contacts" className={this.props.expand ? "expanded" : ""}>
                <ul className="list-unstyled">
                    {conversations}
                </ul>
            </div>
        );
    }
}