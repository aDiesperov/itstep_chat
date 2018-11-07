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
                <div id="search">
                    <label><i className="fa fa-search" aria-hidden="true" /></label>
                    <input readOnly type="text" placeholder="Search contacts..." />
                </div>
                <Contacts changeChat={this.props.changeChat} selectedChat={this.props.selectedChat} expand={this.state.expand} />
                <div id="bottom-bar">
                    <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true" /> <span>Add contact</span></button>
                    <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true" /> <span>Settings</span></button>
                </div>
            </div>
        );
    }
}