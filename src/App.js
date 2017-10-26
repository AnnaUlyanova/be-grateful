import React, { Component } from 'react';
import fire, { auth, provider } from './fire';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentText: '',
      date: '',
      messages: [],
      user: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });

    const messagesRef = fire.database().ref('messages');
    messagesRef.on('value', (snapshot) => {
      let messages = snapshot.val();
      let newState = [];
      for (let message in messages) {
        newState.push({
          id: message,
          currentText: messages[message].currentText,
          date: messages[message].date,
        })
      }
      this.setState({
        messages: newState
      })
    })
  }

  logout () {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  login() {
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
      date: new Date().getHours() //create function for Date!
    });
  }

  addMessage(e){
    e.preventDefault();
    const messagesRef = fire.database().ref('messages');
    const message = {
      currentText: this.state.currentText,
      date: this.state.date
    }
    messagesRef.push(message)
    this.setState({
      currentText: '',
      date: ''
    })
  }

  render() {
    const {user} = this.state
    return (
      <div>
        <div>
          {this.state.user ?
            <button onClick={this.logout}>Log Out</button>
            :
            <button onClick={this.login}>Log In</button>
          }
        </div>
          <div className={user ? 'main-container' : 'main-container-hide'}>
          <form onSubmit={this.addMessage}>
            <input type="text" onChange={this.handleChange} value={this.state.currentText} />
            <input type="submit" />
          </form>
          <h1>Todays messages</h1>
          <ul>
            {this.state.messages.map((message) => {
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
