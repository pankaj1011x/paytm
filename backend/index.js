import express from "express";

import mainRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
