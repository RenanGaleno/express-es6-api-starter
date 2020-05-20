import dotenv from "dotenv";

import dev from "./dev";
import production from "./production";
import test from "./test";

dotenv.config();

const config = {
  port: 3000,
  bodyLimit: "100kb",
  corsHeaders: ["Link"],
};

export const setupConfig = () => {
  let exportCfg;

  if (process.env.NODE_ENV === "test") {
    exportCfg = {
      ...config,
      ...test(),
    };
  } else if (process.env.NODE_ENV === "prod") {
    exportCfg = {
      ...config,
      ...production(),
    };
  } else {
    exportCfg = {
      ...config,
      ...dev(),
    };
  }

  return exportCfg;
};

export default setupConfig();
