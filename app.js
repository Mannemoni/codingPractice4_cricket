const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const databasePath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();
//////

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieID: dbObject.movie_id,
    directorID: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//////
app.get("/movies/", async (request, response) => {
  const movieQuery = `
    SELECT * FROM movie`;
  const movieArray = await db.all(movieQuery);
  response.send(
    movieArray.map((eachMovie) => {
      convertDbObjectToResponseObject(eachMovie);
    })
  );
});
///post
app.post("/movies/", async (request, response) => {
  const { directorID, movieName, leadActor } = request.body;
  const postQuery = `INSERT INTO movie (director_id,movie_name,lead_actor)
    Values  ('${directorID}', ${ovieName}, '${leadActor}');`;
  const a = await db.run(postQuery);
  response.send("Movie Successfully Added");
});

module.exports = app;
