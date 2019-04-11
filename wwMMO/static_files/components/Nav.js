class Nav extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='nav'>
                <MyButton btnView='game' handler={this.props.handler} value='Game' className={'centerBox'} />
                <MyButton btnView='scores' handler={this.props.handler} value='Scores' className={'centerBox'} />
                <MyButton btnView='profile' handler={this.props.handler} value='Profile' className={'centerBox'} />
                <MyButton btnView='logout' handler={this.props.handler} value='Logout' className={'centerBox'} />
            </div>
        );
    }
}
