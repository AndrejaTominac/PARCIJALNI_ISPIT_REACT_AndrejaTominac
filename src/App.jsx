import { useState, useCallback } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [data, setData] = useState([]);

  const getUser = useCallback(
    (event) => {
      event.preventDefault();
      const userName = event.target.username.value;
      if (!userName || userName.trim() === "") {
        alert("No such User! Please enter a correct username. Thank you!");
        event.target.username.value = "";
        return;
      }

      const userPromise = fetch(
        "https://api.github.com/users/" + userName
      ).then((response) => response.json());

      const reposPromise = fetch(
        "https://api.github.com/users/" + userName + "/repos"
      ).then((response) => response.json());

      Promise.all([userPromise, reposPromise]).then((values) => {
        console.log(values);
        const userData = values[0],
          userReposData = values[1];

        const repos = [];
        userReposData.forEach((repoData) => {
          repos.push({
            id: repoData.id,
            name: repoData.name,
          });
        });

        data.pop();

        const newData = {
          avatar_url: userData.avatar_url,
          name: userData.name,
          location: userData.location,
          bio: userData.bio,
          repos: repos,
        };

        setData([...data, newData]);
      });
    },
    [data]
  );

  return (
    <div className="app">
      <div className="container">
        <form onSubmit={getUser}>
          <label>GitHub username:</label>
          <input name="username" type="text" placeholder="Enter user..." />
          <button type="submit">GO!</button>
        </form>
        <br />
        {data.length > 0 ? (
          <div>
            <div className="header">
              <img src={data[0]?.avatar_url} alt={data[0].name} />
              <h1>{data[0]?.name}</h1>
            </div>
            <p>
              {" "}
              <b>BIO:</b> {data[0]?.bio}
            </p>
            <p>
              {" "}
              <b>LOCATION:</b> {data[0]?.location}
            </p>
            <p>
              {" "}
              <b>REPOSITORIES:</b>
            </p>
            <ListGroup>
              {data[0].repos.map((repo) => (
                <ListGroupItem key={repo.id} className="repos-list">
                  <p>{repo.name}</p>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
