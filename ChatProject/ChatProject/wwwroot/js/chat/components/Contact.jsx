class Contact extends React.Component {
    render() {
        return (
            <li onClick={this.props.active ? null : this.props.onClick} className={this.props.active === true ? "contact active" : "contact"}>
                <div className="wrap">
                    <img src={this.props.src} alt={this.props.alt} />
                    <div className="meta">
                        <p className="name">{this.props.name}</p>
                        <p className="preview">{this.props.children !== '' ? this.props.children : <small>Empty</small>}</p>
                    </div>
                </div>
            </li>
        );
    }
}