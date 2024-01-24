import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

import { STATUS_CODES } from "./constants";

dotenv.config();

const app: Express = express();
const url = process.env.URL || "https://httpstatus.is";
const port = process.env.PORT || 3000;
const poweredBy = process.env.POWERED_BY || "helloapi.co";

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Powered-By", poweredBy);
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).set("Content-Type", "text/plain").send("Hello, World!");
});

app.get("/:code", (req: Request, res: Response) => {
  const code = parseInt(req.params.code);
  const redirect = STATUS_CODES[code]?.redirect;

  if (Number.isNaN(code) || code > 999) {
    return res
      .status(400)
      .send({ code: 400, error: STATUS_CODES[400].description });
  }

  if (redirect) {
    return res.status(code).redirect(url);
  }

  const description = STATUS_CODES[code]?.description || "Unknown code :(";
  const official = STATUS_CODES[code]?.official;

  return res.status(code).send({ code, official, description });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at ${url}`);
});
