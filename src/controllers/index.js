import { Router } from "express";
import { name, version } from "../../package.json";

// Import your controllers here
import authController from "./auth.controller";

export default () => {
  const api = Router();

  /* Add your controllers here */
  api.use("/auth", authController); // Auth

  // API information
  api.get("/", (req, res) => {
    res.json({
      app: name,
      version,
    });
  });

  return api;
};
