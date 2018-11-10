class Search extends React.Component {

    handleChangeSearch(e) {
        this.props.changeSearch(e.target.value);
    }

    render() {
        return (
            <div id="search">
                <label><i className="fa fa-search" aria-hidden="true" /></label>
                <input onChange={this.handleChangeSearch.bind(this)} type="text" placeholder="Search contacts..." />
            </div>
        );
    }
}