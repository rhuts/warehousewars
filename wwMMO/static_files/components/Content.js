class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            view: 'login',
            isLoggedIn:false,
            registerError:false,
            loginError:false,
            justRegistered:false,
            afterchangeUsername: false,
            afterchangePassword: false
        };
        this.handler = this.handler.bind(this);
        this.afterRegister = this.afterRegister.bind(this);
        this.afterLogin = this.afterLogin.bind(this);

        this.afterChangeUsername = this.afterChangeUsername.bind(this);
        this.afterChangePassword = this.afterChangePassword.bind(this);

        this.sendEnteringGame = this.sendEnteringGame.bind(this);
        this.sendLeavingGame = this.sendLeavingGame.bind(this);
    }


    afterRegister(registered) {
        DEBUGclient('after registerAccount: ');
        if (registered) {
            // conditionally render login
            DEBUGclient('successfuly registered account in content');
            this.setState({'view': 'login'});
            this.setState({justRegistered: true});
        } else {
            DEBUGclient('failed to register account');
            this.setState({registerError: true});
        }
    }

    afterLogin(verified) {
        DEBUGclient('after Logging in: ');
        if (verified) {
            // conditionally render login
            DEBUGclient('successfuly logged in');
            this.sendEnteringGame();
            this.setState({'view': 'game'}); // TODO change to worlds if we get there
            this.setState({isLoggedIn: true});
        } else {
            DEBUGclient('failed to log in');
            this.setState({loginError: true});
        }
    }

    afterChangeUsername(response){
        DEBUGclient('after changing username');
        if (response){
            this.setState({afterChangeUsername: true});
            this.setState({isLoggedIn: false, 'view': 'login'});
        }

    }

    afterChangePassword(response) {
        DEBUGclient('after changing password');
        if (response) {
            this.setState({afterchangePassword: true});
            this.setState({isLoggedIn: false, 'view': 'login'});
        }
    }

    sendEnteringGame() {
        var msg = {};
        msg['action'] = 'enterGame';
        msg['playerId'] = global.username;

        var msgStr = JSON.stringify(msg);
        socket.send(msgStr);
    }

    sendLeavingGame() {
        var msg = {};
        msg['action'] = 'leaveGame';
        msg['playerId'] = global.username;

        var msgStr = JSON.stringify(msg);
        socket.send(msgStr);
    }

    // when a button is pressed
    handler(props, e) {

        this.setState({justRegistered: false});

        // maintain an array of possible views
        var views = ['login', 'register', 'game', 'scores', 'profile', 'logout'];

        // IF changing view button pressed
        if ($.inArray(props.btnView, views) != -1) {


            // handle entering and leaving game =========================\\\
            // handle entering and leaving game =============================\\\
            // entering game afterLogin (called in that function) and when pressing Game button from non game view
            if (props.btnView == 'game' && this.state.view != 'game') {

                this.sendEnteringGame();

            // leaving game
        } else if (props.btnView != 'game') {

                this.sendLeavingGame();
            }

            // handle entering and leaving game =============================///
            // handle entering and leaving game =========================///

            DEBUGclient('in Content (Parent), changing view from: '+this.state.view);
            this.setState({registerError: false});
            this.setState({view: props.btnView}, function() {
                DEBUGclient('in Content (Parent), changing view to: '+props.btnView);
            });

        // ELSE other button
        } else {
            switch(props.btnView) {
                case 'registerAccount':
                    DEBUGclient('Create account btn pressed');

                    // ONLY send to server if form is valid
                    if (props.regState.formValid) {
                        let username = props.regState.username;
                        let password = props.regState.password;

                        DEBUGclient('registration form was valid');

                        registerAccount(username, password, this.afterRegister);


                    }
                    break;

                case 'loginAccount':
                    DEBUGclient('Login btn pressed');

                    if (props.logState.formValid) {
                        let username = props.logState.username;
                        let password = props.logState.password;

                        DEBUGclient('login form was valid');

                        loginAccount(username, password, this.afterLogin);

                    }


                case 'changeUsername':

                    DEBUGclient('in change username case in handler');

                    let currUname1 = props.currUname;
                    let newUname = props.newUname;

                    changeUsername(currUname1, newUname, this.afterChangeUsername);


                case 'changePassword':

                    DEBUGclient('in change password case in handler');

                    let currUname2 = props.currUname;
                    let newPassword = props.newPassword;

                    changePassword(currUname2, newPassword, this.afterChangePassword);
            }
        }
    }


    render() {

        DEBUGclient('rendering content.js, this.state.view = '+this.state.view);

        switch(this.state.view) {
            case 'login':
                DEBUGclient('in case: login');
                return (
                    <Login handler={this.handler} error={this.state.loginError} afterChangeUsername={this.state.afterChangeUsername} afterChangePassword={this.state.afterChangePassord} justReg={this.state.justRegistered}/>
                );

            case 'register':
                DEBUGclient('in case: register');
                return (
                    <Register handler={this.handler} error={this.state.registerError}/>
                );

            case 'worlds':
                return (
                    <Worlds handler={this.handler} />
                );

            case 'game':
                return (
                    <Game handler={this.handler} />
                );

            case 'scores':
                return (
                    <Scores handler={this.handler} />
                );

            case 'profile':
                return (
                    <Profile handler={this.handler} />
                );

            case 'logout':
                return (
                    <Login handler={this.handler} error={this.state.loginError} justReg={this.state.justRegistered}/>
                );
        }
    }
}
