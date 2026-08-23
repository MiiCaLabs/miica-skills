#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { listCatalog } from "../src/skills.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skills = await listCatalog(path.join(root, "skills"));

if (skills.length === 0) throw new Error("The catalog must contain at least one skill.");
process.stdout.write(`Validated ${skills.length} skills: ${skills.map((skill) => skill.name).join(", ")}\n`);
