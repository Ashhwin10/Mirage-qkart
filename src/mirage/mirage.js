import { createServer } from "miragejs";
import { seeds, models } from "./seeds";
import { routes } from "./routes";

export function MirageSetup({ environment = "development" } = {}) {
  const server = createServer({
    environment,
    seeds,
    models,
    routes,
  });
  return server;
}
