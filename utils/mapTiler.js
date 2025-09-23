import dotenv from "dotenv";
dotenv.config();

import { config, geocoding } from "@maptiler/client";
import fetch from "node-fetch";

// Set the API key and fetch function
config.apiKey = process.env.MAP_API_KEY;
config.fetch = fetch;

export default geocoding;
