import { recursiveReadDirSync } from "./recursiveReadDirSync.mjs"
import {readFileSync, writeFileSync} from "fs"

const dtsFiles = recursiveReadDirSync("./node_modules/@octokit").filter(f => f.endsWith(".d.ts") || f.endsWith(".json") || f.endsWith(".js"))
const dtsObj = {}
dtsFiles.forEach(key => dtsObj[key] = readFileSync(key, "utf8"))
writeFileSync("vendor/dts.js", `const DTS = ${JSON.stringify(dtsObj)}; export default DTS`)
console.log("vendor/dts.js written")