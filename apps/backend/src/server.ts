import http from "node:http";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { initRealtime } from "./socket/realtime.js";
import { logger } from "./utils/logger.js";

const app = createApp();
const server = http.createServer(app);

initRealtime(server);
await connectDatabase();

server.listen(env.PORT, () => {
  logger.info(`VedaAI API listening on ${env.PORT}`);
});
