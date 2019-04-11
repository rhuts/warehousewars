class Game extends React.Component {
    // client is dumb so we should get everything from the server constantly
    // when we choose to move, tell the server we want to move in some direction, no calculating here
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='game'>
                <h2>WAREHOUSE WARS</h2>
                <Nav handler={this.props.handler} />
                <br />
                <div className='gamecontrols'>
                    <Stage />
                    <Controls />
                </div>
                <Timer />
            </div>
        );
    }
}
