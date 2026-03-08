import pinoHttp from "pino-http";

export default pinoHttp({
  customLogLevel: function (res, err) {
    if ((res.statusCode ?? 500) >= 500 || err) return "error";
    if ((res.statusCode ?? 0) >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} completed`;
  },

  customErrorMessage: function (req, res) {
    return `${req.method} ${req.url} failed`;
  },
});
