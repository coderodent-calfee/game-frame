"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var path_1 = require("path");
// Load .env file
var envPath = (0, path_1.resolve)(__dirname, '../../.env');
(0, dotenv_1.config)({ path: envPath });
// Define the output file path
var outputPath = (0, path_1.resolve)(__dirname, './utils/environment.ts');
// Collect environment variables
var envVariables = process.env;
// Generate TypeScript content
var tsContent = "\n  // This file is auto-generated. Do not edit manually.\n  export const environment = {\n    ".concat(Object.entries(envVariables)
    .map(function (_a) {
    var key = _a[0], value = _a[1];
    return "\"".concat(key, "\": ").concat(JSON.stringify(value), ",");
})
    .join('\n    '), "\n  } as const;\n");
// Write to the output file
(0, fs_1.writeFileSync)(outputPath, tsContent);
console.log("Environment variables written to ".concat(outputPath));
