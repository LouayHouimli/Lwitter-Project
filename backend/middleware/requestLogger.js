let requestCount = 0;

const requestLogger = (req, res, next) => {
  requestCount++;
  console.log(`API Request #${requestCount}: ${req.method} ${req.url}`);
  next();
};

export default requestLogger;