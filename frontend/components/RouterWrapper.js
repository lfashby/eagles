import React, { Component } from 'react';
import App from './App';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer.js';
import Lesson from './Lesson/Lesson.js';
import LessonCreator from './Creator/LessonCreator';
import User from './User';
import Login from './Auth/Login';
import Logout from './Auth/Logout'


class RouterWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      loggedIn: false,
      displayLogginError: false,
      username: 'william',
      userRef: '59c2ce2af424e2541cb7b508'
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getLessons = this.getLessons.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.queryDataBaseWithSearchInput = this.queryDataBaseWithSearchInput.bind(this);
  }

  componentDidMount() {
    this.getLessons();
  }

  getLessons() {
    fetch('/lessons')
    .then((res) => res.json())
    .then((lessons) => this.setState({lessons}))
    .catch((err) => console.log('Error getting lessons', err));
  }

  queryDataBaseWithSearchInput(searchInput) {
    this.getLessons()
    .then((results) => {
      console.log(this.state.lessons);
      var filteredLessons = this.state.lessons.filter((lesson) => { 
        var lowerSearchInput = searchInput.toLowerCase();
        if (lesson.keywords.includes(lowerSearchInput) || lowerSearchInput === '') {
          return lesson;
        }
      });
      this.setState({
        lessons: filteredLessons,
      });
      console.log(this.state.lessons)
    })
  }

  organizeSearchResultsBasedOnMostLikes() {
    var lessons = this.state.lessons;
    lessons.sort(function(lesson1, lesson2) {
      return lesson1.likes - lesson2.likes;
    })
    this.setState({
      lessons: lessons
    });
  }

  createAccount(username, passowrd) {
    console.log('IMPLIMENT THIS TO CREATE ACCOUNTS!!!')
  }

  login(username, password) {
    let data = {
      username: username,
      password: password
    };
    fetch('/login', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('got data', data);
      if(data.loggedIn === true) {
        this.setState({ 
          username: data.username,
          loggedIn: true,
          displayLogginError: false
         });
      } else {
        this.setState({ displayLogginError: true });
      }
    })
    .catch((err) => console.log('Error Logging In!', err));
  }

  logout() {
    console.log('logging out');
    this.setState({ 
      loggedIn: false,
      displayLogginError: false,
      username: '',
      userRef: ''
     });
  }


  render() {
    return (
      <BrowserRouter>
        <App queryDataBaseWithSearchInput={this.queryDataBaseWithSearchInput.bind(this)} logout={this.logout}>
          { this.state.loggedIn ?
         (<Switch>
            <Route exact path='/'
              render={() => (
                <LessonPreviewContainer 
                  lessons= { this.state.lessons }
                /> 
              )}
            />
            <Route path='/lesson/:id'
              component={ Lesson }
            />
            <Route path='/create'
              render={ () => <LessonCreator username={this.state.username} userRef={this.state.user} /> }
            />
            <Route path='/user' render={ () => 
                <User 
                  username={ this.state.username }
                />
              }
            />
            <Route path='/logout' render={ () => {
              console.log('logging out route');
              return <Logout logout={ this.logout }/>
            }} 
            />
          </Switch>) :
          (<Switch>
              <Route path='*' render={ () => 
                <Login login={ this.login } 
                       displayLogginError={ this.state.displayLogginError }
                       createAccount={ this.createAccount }
                />
              }/>
            </Switch>)
            }
        </App>
      </BrowserRouter>
    );
  }
}

export default RouterWrapper;