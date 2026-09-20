import { readFileSync } from "node:fs";
import { importApprovedWork } from "../publication/update-work.js";
const args = process.argv.slice(2);
const value = (name: string) => args[args.indexOf(name) + 1];
if (!args.includes("--work") || !args.includes("--input")) throw new Error("Usage: npm run publication:import -- --work wrk_id --input reviewed-bundle.json [--expressions reviewed-expressions.json] [--replace-shared]");
const bundle = JSON.parse(readFileSync(value("--input")!, "utf8"));
const expressions = args.includes("--expressions") ? JSON.parse(readFileSync(value("--expressions")!, "utf8")) : { identities: [], occurrences: [], preparedQuizzes: [] };
const backup = importApprovedWork(bundle, expressions, value("--work")!, args.includes("--replace-shared"));
console.log(`Approved work imported; previous source retained at ${backup}. Nothing was deployed.`);
