const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  var cookies = req && req.cookies ? req.cookies : {};
  var { username } = req.body;

  if (Object.keys(cookies).length > 0) {
    var cookieId = cookies['session_id'];
    console.log(cookieId, cookies, 'AUTH COOKIES LINE 10');

    models.Sessions.get(cookieId).then((sess) => {
      next();
    }).catch((err) => console.log('Error in AUTH line 12 ' + err));
  } else {
    var username = req.body.username;
    models.Users.get({ username }).then((user) => {
      console.log('doYOUEXIST', user);
      if (user !== undefined && user.id) {
        models.Sessions.create(user.id).then((sess) => console.log('?????', sess));
      }
    }).catch((err) => console.log(err));

    next();

    // req.session = session;
    // res.set({
    //   'set-cookie': `session_id=${session.hash}`,
    //   'location': '/'
    // })
  };
};
/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

// ResultSetHeader { ^ .^)
//   fieldCount: 0,  ""
//   affectedRows: 1,
//   insertId: 1,
//   info: '',
//   serverStatus: 2,
//   warningStatus: 0
// }