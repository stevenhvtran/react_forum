import React, { Component } from "react";
import "./App.css";
import { Fetch } from "react-request";
import loading from "./loading.gif";

class App extends Component {
  render() {
    return (
      <body>
        <h1 className="title">REACT FORUM</h1>
        <PostsWrapper/>
      </body>
    );
  }
}

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "something",
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
  render() {
    return (
      <div className="post-wrapper">
        <RegisterForm/>
        <Fetch url="https://flask-forum-api.herokuapp.com/api/posts">
          {({ fetching, failed, data }) => {
            if (fetching) {
              return <img className="center" src={loading} alt="loading" />;
            }

            if (failed) {
              return "The request did not succeed.";
            }

            if (data) {
              var postsElements = data.posts;
              return postsElements.map(post => <Post post_id={post.post_id} />);
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
      <Fetch url={this.baseApiUrl + this.props.post_id}>
        {({ fetching, failed, data }) => {
          if (fetching) {
            return (
              <div className="post">
                <img className="center" src={loading} alt="loading" />
              </div>
            );
          }

          if (failed) {
            return <div className="post">The request did not succeed.</div>;
          }

          if (data) {
            return (
              <div className="post">
                <div className="post-title">{data.title}</div>
                <div className="post-body">{data.body}</div>
                <div className="post-author">by {data.author_name}</div>
              </div>
            );
          }

          return null;
        }}
      </Fetch>
    );
  }
}

export default App;
