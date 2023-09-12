require("dotenv").config();

import { seedDemo } from "./seedDemo";
seedDemo().then(() => {
  process.exit(0);
});
