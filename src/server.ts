import express, { Application } from "express";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import connectToDb from "./db";
import routes from "./routes";

const app = express();

// mongoose
//   .connect(config.mongo.url)
//   .then(() => {
//     console.log("Mongo connected");
//     startServer();
//   })
//   .catch((error: any) => {
//     console.log(error);
//   });

// // start the server after mongo connects
// const startServer = () => {
//   router.use(express.urlencoded({ extended: true }));
//   router.use(express.json());

//   router.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//     );
//     if (req.method == "OPTIONS") {
//       res.header(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//       );
//     }

//     next();
//   });

//   router.use("/users", userRouter);
//   router.use("/blog", blogPostRouter);

//   //   route check
//   router.get("/", (req, res, next) =>
//     res.status(200).json({ message: "service running" })
//   );

//   //   route error
//   router.use((req, res, next) => {
//     const error = new Error("route not found");
//     console.log(error);
//     return res.status(400).json({ message: error.message });
//   });

//   http
//     .createServer(router)
//     .listen(config.server.port, () =>
//       console.log(`Server running on port ${config.server.port}.`)
//     );
// };

class ExpressServer {
  constructor() {
    app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ): void => {
        bodyParser.json({ limit: "100kb" })(req, res, next);
      }
    );
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "100kb",
      })
    );

    app.use(cors());
  }

  router(routes: (router: Application) => void): ExpressServer {
    app.enable("case sensitive routing");
    app.enable("strict routing");
    // number of proxies/LB between the user and the server.
    // Used by express-rate-limit to read the real client ip via request.ip and not the LB ip address
    app.set("trust proxy", 1);

    routes(app);
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        return res
          .status(err.status || 500)
          .json({ message: err.message, success: false });
      }
    );
    return this;
  }

  listen(p: number): Application {
    const welcome = (port: number) => () =>
      console.log(
        `up and running in ${
          process.env.NODE_ENV || "development"
        } on port: ${port}}`
      );
    connectToDb().then(() => {
      http.createServer(app).listen(p, welcome(p));
    });

    return app;
  }
}

export default new ExpressServer().router(routes).listen(5000);

declare module "express-serve-static-core" {
  interface Request {
    user: any;
    sanitizedData: any;
  }
}
