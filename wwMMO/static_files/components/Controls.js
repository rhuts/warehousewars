class Controls extends React.Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick (move) {
        sendMoveMsg(move);
    }

    render() {
        return (
            <div className="controls">
                <h2 >Controls</h2>
                <table id="controls">
                    <tbody>
                        <tr>
                            <td><img id="nw" src="images/north_west.svg" onClick={() => this.onClick('Q')} /></td>
                            <td><img id="n" src="images/north.svg" onClick={() => this.onClick('W')} /></td>
                            <td><img id="ne" src="images/north_east.svg" onClick={() => this.onClick('E')} /></td>
                        </tr>
                        <tr>
                            <td><img id="w" src="images/west.svg" onClick={() => this.onClick('A')} /></td>
                            <td>&nbsp;</td>
                            <td><img id="e" src="images/east.svg" onClick={() => this.onClick('D')} /></td>
                        </tr>
                        <tr>
                            <td><img id="sw" src="images/south_west.svg" onClick={() => this.onClick('Z')} /></td>
                            <td><img id="s" src="images/south.svg" onClick={() => this.onClick('X')} /></td>
                            <td><img id="se" src="images/south_east.svg" onClick={() => this.onClick('C')} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
