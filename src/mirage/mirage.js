// MirageJS setup

import { createServer } from "miragejs";
import { seeds,models } from "./seeds";
import { routes } from "./routes";


export function MirageSetup() {
  createServer({
    seeds,
    models,
    routes,
  });
}
