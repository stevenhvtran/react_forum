import React, { Component } from "react";
import "./App.css";
import { Fetch } from "react-request";

class App extends Component {
  render() {
    return (
      <body>
        <h1 className="title">REACT FORUM</h1>
        <Post post_id="1" />
      </body>
    );
  }
}

class Post extends Component {
  render() {
    return (
      <Fetch
        url={
          "https://flask-forum-api.herokuapp.com/api/post/" + this.props.post_id
        }
        method="GET"
      >
        {({ fetching, failed, data }) => {
          if (fetching) {
            return <div>Loading data...</div>;
          }

          if (failed) {
            return <div>The request did not succeed.</div>;
          }

          if (data) {
            return (
              <div>
                <div>Post Title: {data.title}</div>
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
