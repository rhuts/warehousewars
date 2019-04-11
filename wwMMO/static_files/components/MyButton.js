class MyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickCount : 0 ,
            isPrime : "Not a prime number"
        }

    }


    render(){
        var value = this.props.value;
        var btnView = this.props.btnView;
        var className = this.props.className;
        var valid = this.props.valid;
        // console.log('valid:'+valid);

        return (
            <button className={className} onClick={e => this.props.handler(this.props, e)} >
                {value}
            </button>
    );
  }
}
