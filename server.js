const http = require("http");
const express = require("express");
const es6Renderer = require("express-es6-template-engine");
const pgp = require("pg-promise")();

const hostname = "127.0.0.1";
const port = 3000;

const app = express();
const server = http.createServer(app);
const db = pgp("postgres://localhost:5432/breakfast");

// configure the template engine
app.engine("html", es6Renderer); // register the template engine
app.set("views", "views"); // where to look for templates (AKA views)
app.set("view engine", "html"); // which template engine should express use

app.get("/", (req, res) => {
  db.any("SELECT * FROM foods")
    .then((data) => {
        //once we have data we can render homepage
        // views/hpome.html
    res.render("home", {
      // locals is variables available inside the template
      locals: {
        foods: data,
        title: "Breakfast Foods",
      },
      // partials is a list of partials to load for use in the template
      partials: {
        head: "partials/head",
        foot: "partials/foot",
      },
    });
  });
  // views/home.html
});

app.get("/:handle", (req, res) => {
  const { handle } = req.params;

  db.one(`SELECT * FROM foods WHERE handle = $1`, [handle])
    .then((food) => {
      res.render("food-profile", {
        locals: {
          food: food,
          title: `Breakfast Food: ${food.name}`,
        },
        partials: {
          head: "partials/head",
          foot: "partials/foot",
        }
      })
    })
      .catch(error => {
        res.status(404).send("Could not find that food");
      })

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
