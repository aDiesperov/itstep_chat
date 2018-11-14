class ContactProfile extends React.Component {
    render() {
        return (
            <div className="contact-profile">
                <img src={"/images/" + this.props.image} alt="" />
                <p>{this.props.title}</p>

                {this.props.markedMessages ? (
                    <div className="bar-messages">
                        <button onClick={this.props.unmarkingAllMessages} className="btn btn-success"><span className="glyphicon glyphicon-unchecked" /></button>
                        <button onClick={this.props.deletingMessages} className="btn btn-danger"><span className="glyphicon glyphicon-trash" /></button>
                    </div>
                ) : null}

            </div>
        );
    }
}