import React, { Component } from 'react';
import fire, { auth, provider } from './fire';
import propEq from 'ramda/src/propEq';
import filter from 'ramda/src/filter';

//import LoginForm from './components/LoginForm'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: '',
      date: '',
      messages: [],
      user: null,

      email: '',
      password: '',
      error: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);

    this.onLogin = this.onLogin.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.logout = this.logout.bind(this);
    this.showTodaysMessages = this.showTodaysMessages.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user
        });
      }
    });
  }

  logout () {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  loginGoogle() {
    auth.signInWithPopup(provider)
      .then((result) => {
      console.log('RESULT', result)
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  handleChange(e) {
    this.setState({
      currentText: e.target.value,
      date: new Date().getTime()
    });
  }

  addMessage(e){
    e.preventDefault();
    const user = fire.auth().currentUser;
    let userId
    if (user) {
       userId = user.uid;
    }

    const messagesRef = fire.database().ref('/messages/' + userId);
    const message = {
      currentText: this.state.currentText,
      date: this.state.date,
    }
    messagesRef.push(message)
    this.setState({
      currentText: '',
      date: '',
    })
  }

  showTodaysMessages () {
    const userAu = fire.auth().currentUser;
    let userId
    if (userAu) {
      userId = userAu.uid;
    }

    const messagesRef = fire.database().ref('/messages/' + userId);
    messagesRef.once('value', (snapshot) => {

      let messages = snapshot.val();
      console.log('Messages from FB', messages)
      let newState = [];
      for (let message in messages) {
        newState.push({
          id: message,
          currentText: messages[message].currentText,
          date: messages[message].date,
        })
      }
      console.log('New State from FB', newState)
      const todayDate = new Date();
      const isTodaysDate = propEq('date', 17)
      const todaysMessages = filter(isTodaysDate, newState)

      console.log('todaysMessages filtered', todaysMessages)

      this.setState({
        messages: newState
      })
    })
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({
      email: e.target.value,
    });
  }

  handlePassword(e) {
    e.preventDefault();
    this.setState({
      password: e.target.value,
    });
  }

  onLogin (e) {
    e.preventDefault();
    const { email, password } = this.state;
    fire.auth().signInWithEmailAndPassword(email, password)
      .then(user => console.log(user))
      .catch(e => console.log(e.message))
  }

  onSignup (e) {
    e.preventDefault();
    const { email, password } = this.state;
    fire.auth().createUserWithEmailAndPassword(email, password)
      .then(user => console.log(user))
      .catch(e => console.log(e.message))

  }

  render() {
    const {user, messages} = this.state
    let userName = 'User Name'
    if (user) {
      userName = user.displayName
    }
    return (
      <div>
        <div>
          {user ?
            <button onClick={this.logout}>Log Out</button>
            :
            <div>
              <button onClick={this.loginGoogle}>Log In With Google</button>
              <div>
              </div>
                {/*<LoginForm/>*/}
              <div>
                <h1>Login with Email Form</h1>
                <form>
                  <input type="email" label='Email Address' placeholder='you@domain.com' value={this.state.email} onChange={this.handleEmail} />
                  <input type="password" label='Password' placeholder='*******' value={this.state.password} onChange={this.handlePassword} />
                  <button onClick={this.onLogin}>Log In</button>
                  <button onClick={this.onSignup}>Sign Up</button>
                </form>
              </div>
            </div>
          }
        </div>
          <div className={user ?  'main-container' : 'main-container-hide'}>
          <form onSubmit={this.addMessage}>
            <input type="text" onChange={this.handleChange} value={this.state.currentText} />
            <input type="submit" />
          </form>
            <h4>Hi {userName}</h4>
          <h1 onClick={this.showTodaysMessages}>Todays messages</h1>
          <ul>
            {messages.map((message) => {
              return (
                <li key={message.id}>
                <p>{message.currentText}</p>
                </li>
              )
            })}

          </ul>
          </div>
      </div>
  );
  }
}

export default App;
