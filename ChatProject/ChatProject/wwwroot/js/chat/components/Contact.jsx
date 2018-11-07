class Contact extends React.Component {
    render() {
        return (
            <li onClick={this.props.active ? null : this.props.onClick} className={this.props.active === true ? "contact active" : "contact"}>
                <div className="wrap">
                    <span className="contact-status busy" />
                    <img src={this.props.src} alt={this.props.alt} />
                    <div className="meta">
                        <p className="name">{this.props.name}</p>
                        <p className="preview">{this.props.children}</p>
                    </div>
                </div>
            </li>
        );
    }
}