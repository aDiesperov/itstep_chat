class ContactProfile extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            image: 'avatars/default.jpg',
            title: ''
        };

        this.updateData(this.props.selectedChat);
    }

    componentWillReceiveProps(next) {
        this.updateData(next.selectedChat);
    }

    updateData(guid) {
        if (guid) {
            connection.invoke("GetContactProfile", guid).then(contactProfile => {
                if (contactProfile !== null) {
                    this.setState({ image: contactProfile.image, title: contactProfile.title });
                }
            }).catch(reason => {
                console.error('onRejected function called: ' + reason);
            });
        }
    }

    render() {
        return (
            <div className="contact-profile">
                <img src={"/images/" + this.state.image} alt="" />
                <p>{this.state.title}</p>
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true" />
                    <i className="fa fa-twitter" aria-hidden="true" />
                    <i className="fa fa-instagram" aria-hidden="true" />
                </div>
            </div>
        );
    }
}