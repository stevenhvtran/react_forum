import React, { Component } from "react";
import "./App.css";
import loading_gif from "./loading.gif";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      credentials: "",
      user: "",
      showRegister: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleRegisterExit = this.handleRegisterExit.bind(this);
  }

  handleLogin(credentials, user) {
    this.setState({ isLoggedIn: true, credentials: credentials, user: user });
  }

  handleLogout() {
    this.setState({ isLoggedIn: false, credentials: "", user: "Guest" });
  }

  handleRegister() {
    this.setState({ showRegister: true });
  }

  handleRegisterExit() {
    this.setState({ showRegister: false });
  }

  handleLoginLogout() {
    const isLoggedIn = this.state.isLoggedIn;
    const showRegister = this.state.showRegister;
    let display_elements;
    if (showRegister) {
      display_elements = <Register onExit={this.handleRegisterExit} />;
    } else {
      if (isLoggedIn) {
        display_elements = (
          <div className="logged-in">
            {"Logged in as " + this.state.user}
            <button onClick={this.handleLogout}>Logout</button>
          </div>
        );
      } else {
        display_elements = (
          <div>
            <div className="sep">
              Not signed in
              <button onClick={this.handleRegister}>Register</button>
            </div>
            <Login onSuccess={this.handleLogin} />
          </div>
        );
      }
    }

    return <div className="login">{display_elements}</div>;
  }

  render() {
    return (
      <body>
        <div className="banner">
          <h1 className="title">React Forum</h1>
          {this.handleLoginLogout()}
        </div>
        <PostWrapper
          credentials={this.state.credentials}
          user={this.state.user}
        />
      </body>
    );
  }
}

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.handleClick = this.handleClick.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUserChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleClick() {
    fetch("https://flask-forum-api.herokuapp.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.message) {
          this.props.onExit();
        }
      });
  }

  render() {
    return (
      <div className="register">
        <form autocomplete="off">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUserChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            required
          />
          <button type="button" onClick={this.handleClick}>
            Register
          </button>
        </form>
        <button type="button" onClick={this.props.onExit}>
          Login
        </button>
      </div>
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
    var credentials =
      "Basic " + btoa(this.state.username + ":" + this.state.password);
    fetch("https://flask-forum-api.herokuapp.com/api/", {
      headers: {
        Accept: "application/json",
        Authorization: credentials
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.message) {
          this.props.onSuccess(credentials, this.state.username);
        }
      });
  }

  handleUserChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <form autocomplete="off">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={this.state.username}
          onChange={this.handleUserChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          required
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
    this.state = { posts: "", showSubmit: false };
    this.loadPosts = this.loadPosts.bind(this);
    this.handleSubmit = this.enableSubmit.bind(this);
    this.enableSubmit = this.enableSubmit.bind(this);
    this.disableSubmit = this.disableSubmit.bind(this);
  }

  loadPosts() {
    fetch("https://flask-forum-api.herokuapp.com/api/posts")
      .then(response => {
        return response.json();
      })
      .then(json => {
        var post_array = [];
        json.posts.map(post =>
          post_array.push(
            <Post
              post_id={post.post_id}
              credentials={this.props.credentials}
              user={this.props.user}
              onUpdate={this.loadPosts}
            />
          )
        );
        this.setState({ posts: post_array });
      });
  }

  componentDidMount() {
    this.setState({
      posts: <img className="center" src={loading_gif} alt="loading-gif" />
    });
    this.loadPosts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.loadPosts();
    }
  }

  enableSubmit() {
    this.setState({ showSubmit: true });
  }

  disableSubmit() {
    this.setState({ showSubmit: false });
  }

  showSubmit() {
    if (this.state.showSubmit) {
      return (
        <SubmitPost
          onExit={this.disableSubmit}
          credentials={this.props.credentials}
          reloadPosts={this.loadPosts}
        />
      );
    }
  }

  showSubmitButton() {
    if (this.props.credentials) {
      return <button onClick={this.enableSubmit}>Submit Post</button>;
    }
  }

  render() {
    return (
      <div className="post-wrapper">
        <div className="posts-banner">
          <div className="posts-title">Posts</div>
          {this.showSubmitButton()}
        </div>
        {this.showSubmit()}
        {this.state.posts}
      </div>
    );
  }
}

class SubmitPost extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", body: "" };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

  handleClick() {
    fetch("https://flask-forum-api.herokuapp.com/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.credentials
      },
      mode: "cors",
      body: JSON.stringify({
        title: this.state.title,
        body: this.state.body
      })
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.message) {
          this.props.onExit();
          this.props.reloadPosts();
        }
      });
  }

  render() {
    return (
      <div className="submit">
        <form autocomplete="off">
          <textarea
            type="text"
            name="title"
            placeholder="Write post title here..."
            value={this.state.title}
            onChange={this.handleTitleChange}
            className="title"
            required
          />
          <textarea
            type="text"
            name="body"
            placeholder="Write post body here..."
            value={this.state.body}
            onChange={this.handleBodyChange}
            className="body"
          />
          <button type="button" onClick={this.handleClick}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { post: "", user: "" };
    this.loadPosts = this.loadPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.showEdit = this.showEdit.bind(this);
  }

  deletePost() {
    fetch(
      "https://flask-forum-api.herokuapp.com/api/post/" + this.props.post_id,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: this.props.credentials
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.message) {
          this.props.onUpdate()
        }
      });
  }

  showEdit() {}

  loadPost() {
    fetch(
      "https://flask-forum-api.herokuapp.com/api/post/" + this.props.post_id
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        var postData = [
          <div>
            <div className="post-title">{json.title}</div>
            <div>{json.body}</div>
            <div className="post-author">by {json.author_name}</div>
          </div>
        ];
        if (json.author_name === this.props.user) {
          postData.push(
            <div>
              <button onClick={this.showEdit}>Edit</button>
              <button onClick={this.deletePost}>Delete</button>
            </div>
          );
        }
        this.setState({ post: <div className="sep">{postData}</div> });
      });
  }

  componentDidMount() {
    this.setState({
      post: <img className="center" src={loading_gif} alt="loading-gif" />
    });
    this.loadPost();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.loadPost();
    }
  }

  render() {
    return <div className="post">{this.state.post}</div>;
  }
}

export default App;
