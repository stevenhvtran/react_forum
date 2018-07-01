import React, { Component } from "react";
import "./App.css";
import { Fetch } from "react-request";
import loading from "./loading.gif";

class App extends Component {
  render() {
    return (
      <body>
        <h1 className="title">REACT FORUM</h1>
        <Posts />
      </body>
    );
  }
}

class Posts extends Component {
  render() {
    return (
      <Fetch url="https://flask-forum-api.herokuapp.com/api/posts">
        {({ fetching, failed, data }) => {
          if (fetching) {
            return <div className="post-wrapper"><img className="center" src={loading} alt="loading"/></div>;
          }

          if (failed) {
            return <div className="post-wrapper">The request did not succeed.</div>;
          }

          if (data) {
            var postsElements = data.posts;
            return <div className="post-wrapper"> {postsElements.map(post => (<Post post_id={post.post_id}/>))} </div>
          }

          return null;
        }}
      </Fetch>
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
            return <div className="post"><img className="center" src={loading} alt="loading"/></div>;
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
