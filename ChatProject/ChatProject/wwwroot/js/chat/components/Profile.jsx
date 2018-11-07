class Profile extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            avatar: "",
            firstName: "",
            lastName: "",
            middleName: "",
            active: false
        };
        
        connection.invoke("GetProfile").then(profile => {
            this.setState({
                avatar: profile.avatar,
                firstName: profile.firstName,
                lastName: profile.lastName,
                middleName: profile.middleName
            });
        });
    }

    handleStatusChange() {
        this.setState({ active: !this.state.active });
    }    

    render() {
        return (
            <div id="profile" className={this.props.expand ? "expanded" : ""}>
                <div className="wrap">
                    <img onClick={this.handleStatusChange.bind(this)} id="profile-img" src={this.state.avatar === '' ? '' : "images/" + this.state.avatar} className="online" alt="" />
                    <p>{this.state.firstName + " " + this.state.lastName}</p>
                    <i onClick={this.props.onClick} className="fa fa-chevron-down expand-button" aria-hidden="true" />
                    <div id="status-options" className={this.state.active ? "active" : ""}>
                        <ul>
                            <li id="status-online" className="active"><span className="status-circle" /><p>Online</p></li>
                            <li id="status-away"><span className="status-circle" /> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle" /> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle" /> <p>Offline</p></li>
                        </ul>
                    </div>
                    <div id="expanded">
                        <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true" /></label>
                        <input readOnly name="twitter" type="text" value={this.state.firstName} />
                        <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true" /></label>
                        <input readOnly name="twitter" type="text" value={this.state.lastName} />
                        <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true" /></label>
                        <input readOnly name="twitter" type="text" value={this.state.middleName} />
                    </div>
                </div>
            </div>
        );
    }
}