import express from "express";
const router = express.Router();

import userModule from "./modules/user.module"
router.use("/users", userModule)
import listModule from "./modules/list.module"
router.use("/list", listModule)
module.exports = router;