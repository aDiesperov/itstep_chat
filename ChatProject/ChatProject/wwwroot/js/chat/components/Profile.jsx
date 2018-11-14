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

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/chat/GetProfile");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let profile = JSON.parse(xhr.response);
                this.setState({
                    avatar: profile.avatar,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    middleName: profile.middleName
                });
            }
            else if (xhr.readyState === 4) {
                console.error("Warning");
            }
        };

        xhr.send();
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
                        <ul className="list-unstyled">
                            <li id="status-online" className="active"><span className="status-circle" /><p>Online</p></li>
                            <li id="status-away"><span className="status-circle" /> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle" /> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle" /> <p>Offline</p></li>
                        </ul>
                    </div>
                    <div id="expanded">
                        <input readOnly type="text" value={this.state.firstName} />
                        <input readOnly type="text" value={this.state.lastName} />
                        <input readOnly type="text" value={this.state.middleName} />
                    </div>
                </div>
            </div>
        );
    }
}