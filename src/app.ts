import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import logging from "./middleware/logging";
import bookRoutes from "./routes/book.route";
import userRoutes from "./routes/user.route";

const NAMESPACE = "Server";
const app = express();

/** Log the request */
app.use((req: Request, res: Response, next: NextFunction) => {
  /** Log the req */
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    /** Log the res */
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Rules of our API */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

/** Routes go here */
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

/** Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

export default app;
