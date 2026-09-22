import app from "./app.js";
import { env } from "./config/env.js";

app.listen(
  env.port,
  () => {
    console.log(
      `LINE AI Bot running on port ${env.port}`
    );

    console.log(
      `Health: http://localhost:${env.port}/health`
    );
  }
);