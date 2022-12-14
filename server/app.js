const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const Auth = require('./middleware/auth');
const cookieParser = require('./middleware/cookieParser');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', cookieParser, (req, res) => {
  res.render('index');
});

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });


app.post('/links', Auth.createSession,
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });



/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', Auth.createSession, (req, res) => {
  models.Users.get({ 'username': req.body.username }).then((user) => {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password && user) {
      var isAuth = models.Users.compare(password, user.password, user.salt);

      if (isAuth) {
        res.set({
          'location': '/'
        });
        res.render('index');
      } else {
        res.set({
          'location': '/login'
        });
        res.render('login');
      }
    } else {
      res.set({
        'location': '/login'
      });
      res.render('login');
    }

  }).catch((err) => console.log(err));



  // get user buy username
  // run compare with req.body password provided and received user salt, password
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', Auth.createSession, (req, res) => {
  var user = models.Users;

  var { username, password } = req.body;

  if (username && password) {

    user.create(req.body).then((user) => {
      if (user) {
        res.set({
          'location': '/'
        });
        res.render('index');
      }
    }).catch((err) => {
      if (err) {
        res.set({
          'location': '/signup'
        });
        res.render('signup');
      }
    });
  } else if (username === '' || password === '') {
    res.set({
      'location': '/signup'
    });
    res.render('signup');
  }
});

app.get('/logout', (req, res) => {
  // some of the details depend on how exactly you want to set the view for logout
});

app.post('/logout', (req, res) => {
  // some of the details depend on how exactly you want to set the view for logout
});




/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
