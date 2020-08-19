const convict = require("convict");

const app = require("./configs/app");
const mailer = require("./configs/mailer");
const logger = require("./configs/logger");
const server = require("./configs/server");
const db = require("./configs/db");
const helper = require("./configs/helper");
const jwt = require("./configs/jwt");
const redis = require("./configs/redis")
const storage = require("./configs/storage");
const state_district_storage = require("./configs/state-district-storage");

// Define a schema
var config = convict({
	app,
	mailer,
	logger,
	db,
	server,
	helper,
	jwt,
	redis,
	storage,
	state_district_storage
});

// Perform validation
config.validate({ allowed: "strict" });

module.exports = config._instance;
