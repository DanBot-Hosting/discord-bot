import express, { Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import * as Sentry from "@sentry/node";

import router from "./util/router";

export default async () => {
    const app = express();

    require("dotenv").config();
    const port = process.env.verification_server_port;

    Sentry.init({
        dsn: process.env.sentry_dsn,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Express({ app }),
            ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
        ],
        tracesSampleRate: 1.0
    })

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());

    app.use(cors<Request>({ origin: "*" }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());

    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "ejs");

    app.use("/", router);

    app.use(Sentry.Handlers.errorHandler());

    app.listen(port, () => {
        console.log(`[VERIFICATION SERVER] Listening on Port: ${port}`);
    })
}
