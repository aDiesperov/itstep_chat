class Message extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleMarkingMessage(e) {

        this.props.markingMessage(this.props.id);
        e.preventDefault();
    }

    render() {
        let attachments = [];
        if (this.props.attachments !== null) {
            for (let name in this.props.attachments)
                switch (name.slice(name.lastIndexOf('.') + 1).toLowerCase()) {
                    case "png":
                    case "jpg":
                        attachments.push(<span key={name}>
                            <img src={"userFiles/" + name} title={this.props.attachments[name]} /><br />
                        </span>);
                        break;
                    case "mp3":
                        attachments.push(<span key={name}>
                            <audio controls type="audio/mpeg" src={"userFiles/" + name} /> <br />
                        </span>);
                        break;
                    case "ogg":
                        attachments.push(<span key={name}>
                            <audio controls type="audio/ogg" src={"userFiles/" + name} title={this.props.attachments[name]} /><br />
                        </span>);
                        break;
                    case "wav":
                        attachments.push(<span key={name}>
                            <audio controls type="audio/wav" src={"userFiles/" + name} title={this.props.attachments[name]} /><br />
                        </span>);
                        break;
                    case "mp4":
                        attachments.push(<span key={name}>
                            <video controls type="video/mp4" src={"userFiles/" + name} title={this.props.attachments[name]} /><br />
                        </span>);
                        break;
                    case "webm":
                        attachments.push(<span key={name}>
                            <video controls type="video/webm" src={"userFiles/" + name} title={this.props.attachments[name]} /><br />
                        </span>);
                        break;
                    default:
                        attachments.push((<span key={name}>
                            <a href={"userFiles/" + name}>{this.props.attachments[name]}</a><br />
                        </span>));
                        break;
                }
        }
        return (
            <li onContextMenu={this.props.sent ? this.handleMarkingMessage.bind(this) : null} className={(this.props.sent ? "sent" : "replies") + (this.props.markedMessage && this.props.sent ? " marked" : "")}>
                <img src={this.props.src} alt={this.props.alt} />
                <div>
                    {this.props.children}
                    {attachments.length > 0 && this.props.children.length > 0 ? <br /> : null}
                    {attachments}
                </div>
            </li>
        );
    }
}