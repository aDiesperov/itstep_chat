class Message extends React.Component {
    render() {
        return (
            <li className={this.props.sent ? "sent" : "replies"}>
                <img src={this.props.src} alt={this.props.alt} />
                <p>{this.props.children}</p>
            </li>
        );
    }
}