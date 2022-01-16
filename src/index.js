const app = require('./app');

const port = process.env.PORT || 4000;

app.listen(port, () => {
  __log.info(`Server started, listening on port ${port}`);
});