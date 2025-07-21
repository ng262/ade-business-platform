import { getPool } from "@/db";
import connectPgSimple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import internalRouter from "@/routes/internal.routes";
import publicRouter from "@/routes/public.routes";
import {
  responseHandler,
  errorHandler,
} from "@/middleware/response.middleware";
import config from "@/config";

const pool = await getPool();
const PgSession = connectPgSimple(session);

const app = express();

app.use(morgan("dev"));

const publicCors = cors({
  origin: config.cors.publicOrigin,
});

const internalCors = cors({
  origin: config.cors.internalOrigin,
  credentials: true,
});

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      pruneSessionInterval: 86400,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.session.duration,
      httpOnly: true,
      sameSite: config.env === "production" ? "none" : "lax",
      secure: config.env === "production",
    },
  })
);

app.use(responseHandler);

app.use("/api", internalCors, internalRouter);
app.use("/public", publicCors, publicRouter);

app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(`Server running on http://localhost:${config.server.port}`);
});
