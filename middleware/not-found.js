const notFoundMiddleware = (req, res) => {
  res.status(404).end("Error 404: Route does not exist");
};

module.exports = notFoundMiddleware;
