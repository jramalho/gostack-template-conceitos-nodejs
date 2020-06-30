const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function fetchRepository(id, response){
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if(repoIndex === -1){
    return response.status(400).send({Error: 'Repository Not Found'});
  }
  return repoIndex
}

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories)
});


app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  let repo = {
    id:uuid(),
    title,
    url,
    techs,
    likes:0,
  }

  repositories.push(repo);

  return response.status(200).send(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {techs, title, url} = request.body;
  const repoToUpdate = fetchRepository(id, response);

  const repository =  {...repositories[repoToUpdate], ...{techs, title, url}};
  repositories[repoToUpdate] = repoToUpdate;

  return response.status(200).send(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoToDelete = fetchRepository(id, response);

  repositories.splice(repoToDelete, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoToLike = fetchRepository(id, response);

  repositories[repoToLike].likes++;

  return response.status(200).send({likes: repositories[repoToLike].likes})
});

module.exports = app;
