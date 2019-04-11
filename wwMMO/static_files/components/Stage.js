class Stage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateMeToRender: 0
        };
        // this.updateState = this.updateState.bind(this);

        // setInterval(functio n(){
        //     updateState();
        //     DEBUGclient('interval update of stage state');
        // }, 200);
    }

    // updateState() nhj

    render() {
        DEBUGclient('re-rendering stage');
        return (
                <div id='stage' className='stage'>
                    loading stage ...
                </div>
        );
    }
}
