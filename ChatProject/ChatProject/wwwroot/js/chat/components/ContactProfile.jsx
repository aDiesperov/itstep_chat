class ContactProfile extends React.Component {

    render() {
        return (
            <div className="contact-profile">
                <img src={"/images/" + this.props.image} alt="" />
                <p>{this.props.title}</p>
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true" />
                    <i className="fa fa-twitter" aria-hidden="true" />
                    <i className="fa fa-instagram" aria-hidden="true" />
                </div>
            </div>
        );
    }
}