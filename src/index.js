const app = require('./config/app');
const mongoose = require('mongoose');

const {PORT, DB_USER, DB_PASS, DB_CLUSTER, DB_NAME} = process.env;

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}.tdwf4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(DB_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT || 4000, () => {
      __log.info(`Server started, listening on port ${PORT}.`);
    });
  })
  .catch((err) => {
    __log.error(err);
  });