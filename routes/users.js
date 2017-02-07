var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({'message': 'respond with a resource'});
});

router.post('/:id', function(req, res, next) {
  // var userId = req.params.id;
  // var notification = buildNotification({title: "hello", body: "sup"});
  // var message = buildMessage(notification);
  // sendMessage(pushXcs, message, function(result) {
  //   res.json({"message": "Done."});
  // });
});

module.exports = router;
