class Login extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        formErrors: {username: '', password: ''},
        usernameValid: false,
        passwordValid: false,
        formValid: false
      };
  }

  handleUserInput = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      this.setState({[name]: value}, () => {

          // keep track of username for client.js

          DEBUGclient('client username updated in global username to: '+global.username);
          global.username = this.state.username;

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
      DEBUGclient('rendering Login');

      // let user know that they registered
      if (this.props.justReg) {
          DEBUGclient('in login render(), we just registered');
          this.state.formErrors.username = 'successfully registered';
      }

      // let the user know if they failed to login
      if (this.props.error) {
          DEBUGclient('in login render(), we just failed to login');
          this.state.formErrors.username = 'or password is incorrect';
      }

      // let the usr know that they just changed username
      if (this.props.afterChangeUsername) {
          DEBUGclient('in login render(), we just changed username');
          this.state.formErrors.username = 'successfully changed';
      }

      // let the usr know that they just changed password
      if (this.props.afterChangePassword) {
          DEBUGclient('in login render(), we just changed password');
          this.state.formErrors.password = 'successfully changed';
      }

      return (
          <div className='login'>



              <h2>LOGIN</h2>

              <div className={`form-group ${this.errorClass(this.state.formErrors.username)}`}>
              Username: <input type="text" name="username" value={this.state.username} onChange={this.handleUserInput}></input>
              </div>

              <br /><br />

              <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
              Password: <input type="password" name="password" value={this.state.password} onChange={this.handleUserInput}></input>
              </div>

              <div className="dynamicLoginErrors">
                <LoginErrors loginErrors={this.state.formErrors} />
              </div>

              <br /><br />

              <MyButton logState={this.state} btnView='loginAccount' handler={this.props.handler} value='Login' className={'centerBox'} valid={this.state.formValid}/>

              <br /><br />

              <MyButton btnView='register' handler={this.props.handler} name='register' value='Register' className={'centerBox'} />


          </div>
      );

  }
}

const LoginErrors = ({loginErrors}) =>
  <div className='loginErrors'>
    {Object.keys(loginErrors).map((fieldName, i) => {
      if(loginErrors[fieldName].length > 0){
        return (
          <p key={i}>{fieldName} {loginErrors[fieldName]}</p>
        )
      } else {
        return '';
      }
    })}
  </div>
