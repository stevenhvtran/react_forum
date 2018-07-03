import React, { Component } from "react";
import "./App.css";
import { Fetch } from "react-request";
import loading from "./loading.gif";

class App extends Component {
  render() {
    return (
      <body>
        <h1 className="title">REACT FORUM</h1>
        <PostsWrapper />
      </body>
    );
  }
}

class Login extends Component {
  handleLogin(e) {
    e.preventDefault();
    this.props.view
  }
  render() {
    return (
      <Fetch
        url={"https://flask-forum-api.herokuapp.com/"}
        method="GET"
        headers={{
          Accept: "application/json",
          Authorization:
            "Basic " + btoa(this.props.username + ":" + this.props.password)
        }}
        cacheResponse={false}
        lazy={false}
      >
        {({ fetching, failed, data }) => {
          if (fetching) {
            return <img src={loading} alt="loading" />;
          }

          if (failed) {
            return <strong>Login failed</strong>;
          }

          if (data) {
            return <strong onLoad={this.handleLogin.bind(this)}>Login success!</strong>;
          }
        }}
      </Fetch>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showFetch: false
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleUserChange(event) {
    this.setState({ username: event.target.value });
    this.setState({ showFetch: false });
  }
  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
    this.setState({ showFetch: false });
  }

  handleClick() {
    this.setState({ showFetch: true });
  }

  render() {
    return (
      <div className="register">
        <strong>
          {this.state.showFetch ? (
            <Login
              username={this.state.username}
              password={this.state.password}
            />
          ) : (
            <strong>Login</strong>
          )}
        </strong>
        <form>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <button type="button" onClick={this.handleClick}>
            Login
          </button>
        </form>
      </div>
    );
  }
}

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showFetch: false
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleUserChange(event) {
    this.setState({ username: event.target.value });
    this.setState({ showFetch: false });
  }
  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
    this.setState({ showFetch: false });
  }

  handleClick() {
    this.setState({ showFetch: true });
  }

  render() {
    return (
      <div className="register">
        <strong>
          {this.state.showFetch ? (
            <Register
              username={this.state.username}
              password={this.state.password}
            />
          ) : (
            <strong>Register</strong>
          )}
        </strong>
        <form>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <button type="button" onClick={this.handleClick}>
            Register
          </button>
        </form>
      </div>
    );
  }
}

class Register extends Component {
  render() {
    return (
      <Fetch
        url="https://flask-forum-api.herokuapp.com/api/register"
        method="POST"
        body={JSON.stringify({
          username: this.props.username,
          password: this.props.password
        })}
        headers={{
          Accept: "application/json",
          "Content-Type": "application/json"
        }}
        lazy={false}
      >
        {({ fetching, failed, data }) => {
          if (fetching) {
            return <img src={loading} alt="loading" />;
          }

          if (failed) {
            return <strong>Registration failed</strong>;
          }

          if (data) {
            return <strong>Registration success!</strong>;
          }
        }}
      </Fetch>
    );
  }
}

class PostsWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "login",
      credentials: null
    };
  }

  changeView(creds) {
    this.setState({
      view: "project",
      // credentials: creds
    });
  }

  render() {
    return (
      <div className="post-wrapper">
        {this.state.view}
        {this.state.view === "login" ? (
          <div>
            <RegisterForm />
            <LoginForm view={this.changeView.bind(this)}/>
          </div>
        ) : null}
        <Fetch url="https://flask-forum-api.herokuapp.com/api/posts">
          {({ fetching, failed, data }) => {
            if (fetching) {
              return <img className="center" src={loading} alt="loading" />;
            }

            if (failed) {
              return "The request did not succeed.";
            }

            if (data) {
              return data.posts.map(post => <Post post_id={post.post_id} />);
            }

            return null;
          }}
        </Fetch>
      </div>
    );
  }
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.baseApiUrl = "https://flask-forum-api.herokuapp.com/api/post/";
  }

  render() {
    return (
      <div className="post">
        <Fetch url={this.baseApiUrl + this.props.post_id}>
          {({ fetching, failed, data }) => {
            if (fetching) {
              return <img className="center" src={loading} alt="loading" />;
            }

            if (failed) {
              return "The request did not succeed.";
            }

            if (data) {
              return (
                <div>
                  <div className="post-title">{data.title}</div>
                  <div className="post-body">{data.body}</div>
                  <div className="post-author">by {data.author_name}</div>
                </div>
              );
            }

            return null;
          }}
        </Fetch>
      </div>
    );
  }
}

export default App;
