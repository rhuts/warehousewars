class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          pwScore: '',
          formErrors: {username: '', password: ''},
          usernameValid: false,
          passwordValid: false,
          formValid: false
        };
        this.passwordStrength = this.passwordStrength.bind(this);
    }

    passwordStrength(e){
        DEBUGclient('in password strength');
        if(e.target.value === ''){
          this.setState({
            pwScore: 'null'
          })
        }
        else{
          var pw = zxcvbn(e.target.value);
          console.log(pw.score);
          this.setState({
            pwScore: pw.score
          });
        }

  }

    handleUserInput = (e) => {
        DEBUGclient('in handle user input');

        if (e.target.name == 'password') {
            this.passwordStrength(e);
        }

        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value}, () => {
            this.validateField(name, value) });
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'error');
    }




    validateField(field, value) {
        let fieldValidationErrors = this.state.formErrors;
        let usernameValid = this.state.usernameValid;
        let passwordValid = this.state.passwordValid;


        switch (field) {
            case 'username':
            // usernameValid = value.match(/^[a-zA-Z0-9]{4,12}([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                usernameValid = value.length >= 4 && value.length <= 12;
                console.log('username validity:'+usernameValid);
                fieldValidationErrors.username = usernameValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 8;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;

        }
        this.setState({formErrors: fieldValidationErrors,
                        usernameValid: usernameValid,
                        passwordValid: passwordValid
                      }, this.validateForm);

        DEBUGclient('in validate field: '+value);
    }

    validateForm() {
       this.setState({formValid: this.state.usernameValid && this.state.passwordValid});
     }



    render() {
        DEBUGclient('in Register Component, render()');

        // let user know that username is taken
        if (this.props.error) {
            DEBUGclient('in register render(), there was an error found');
            this.state.formErrors.username = 'taken';
        }

        return (
            <div className='register'>
                <h2>REGISTER</h2>

                <div className={`form-group ${this.errorClass(this.state.formErrors.username)}`}>
                Desired Username: <input type="text" name="username" value={this.state.username} onChange={this.handleUserInput}></input>
                </div>

                <br /><br />

                <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>

                <label className="password">
                Desired Password: <input type="password" name="password" value={this.state.password} onChange={this.handleUserInput}></input>
                <span className="password__strength" data-score={this.state.pwScore} />

                </label>
                </div>

                <div className="dynamicLoginErrors">
                  <LoginErrors loginErrors={this.state.formErrors} />
                </div>

                <br /><br />

                <MyButton regState={this.state} btnView='registerAccount' handler={this.props.handler} value='Create Account' className={'centerBox'} valid={this.state.formValid}/>

                <br /><br />

                <MyButton btnView='login' handler={this.props.handler} name='login' value='Back to Login' className={'centerBox'} />
            </div>


        );
    }
}
