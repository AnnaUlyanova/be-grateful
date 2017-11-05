import React, { Component } from 'react';
import fire from '../../fire';

class LoginFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
    };
    this.onLoginPress = this.onLoginPress.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onLoginPress() {
    this.setState({
      error: '',
    });

    const { email, password } = this.state;

    fire.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
      this.setState({
        error: ''
      });
    })
      .catch(() => {
        //Login was not successful, let's create a new account
        fire.auth().createUserWithEmailAndPassword(email, password)
          .then(() => { this.setState({ error: '', loading: false }); })
          .catch(() => {
            this.setState({ error: 'Authentication failed.', loading: false });
          });
      });
  }

  render() {
    return (
      <div>
        <h1>Login with Email Form</h1>
        <form onSubmit={this.onLoginPress}>
          <input type="text" label='Email Address' placeholder='you@domain.com' value={this.state.email} onChange={this.handleEmail} />
            <input type="text" label='Password' placeholder='*******' value={this.state.password} onChange={this.handlePassword} />
            <input type="submit" />
        </form>
      </div>
    )
  }
}

export default LoginFrom;