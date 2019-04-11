class Scores extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='scores'>
                <h2>SCORES</h2>
                <Nav handler={this.props.handler} />
            </div>
        );
    }

}
