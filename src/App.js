import React, { Component } from "react";
import "./App.css";
import loading_gif from "./loading.gif";

class App extends Component {
  constructor() {
    super();
    this.state = { isLoggedIn: false, credentials: "", user:"Guest"};
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin(credentials, user) {
    this.setState({ isLoggedIn: true, credentials: credentials , user:user});
  }

  handleLogout() {
    this.setState({ isLoggedIn: false , credentials: "", user: "Guest"});
  }

  handleLoginLogout() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      // button = <Logout onClick={this.handleLogoutClick} />;
      button = "";
    } else {
      button = <Login onSuccess={this.handleLogin} />;
    }

    return (
      <div className="login">
        {/* <Greeting isLoggedIn={isLoggedIn} /> */}
        Hello {this.state.user}
        {button}
      </div>
    );
  }

  render() {
    return (
      <body>
        <h1 className="title">React Forum</h1>
        <div>{this.handleLoginLogout()}</div>
        <PostWrapper />
      </body>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.handleClick = this.handleClick.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleClick() {
    var credentials = "Basic " + btoa(this.state.username + ":" + this.state.password)
    fetch("https://flask-forum-api.herokuapp.com/api/", {
      headers: {
        Accept: "application/json",
        Authorization: credentials
      }
    })
    .then (response => {
      return response.json();
    })
    .then (json => {
      if (json.message === "Hello steven") {
        this.props.onSuccess(credentials, this.state.username)
      }
    })
    ;
  }

  handleUserChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
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
    );
  }
}

class PostWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { posts: "" };
    this.loadPosts = this.loadPosts.bind(this);
  }

  loadPosts() {
    fetch("https://flask-forum-api.herokuapp.com/api/posts")
      .then(response => {
        return response.json();
      })
      .then(json => {
        var post_array = [];
        json.posts.map(post =>
          post_array.push(<Post post_id={post.post_id} />)
        );
        this.setState({ posts: post_array });
      });
  }

  componentDidMount() {
    this.setState({ posts: <img src={loading_gif} alt="loading-gif" /> });
    this.loadPosts();
  }

  render() {
    return <div className="post-wrapper">{this.state.posts}</div>;
  }
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { post: "" };
    this.loadPosts = this.loadPost.bind(this);
  }

  loadPost() {
    fetch(
      "https://flask-forum-api.herokuapp.com/api/post/" + this.props.post_id
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          post: [
            <div className="post-title">{json.title}</div>,
            <div>{json.body}</div>,
            <div className="post-author">by {json.author_name}</div>
          ]
        });
      });
  }

  componentDidMount() {
    this.setState({ posts: <img src={loading_gif} alt="loading-gif" /> });
    this.loadPost();
  }

  render() {
    return <div className="post">{this.state.post}</div>;
  }
}

export default App;
