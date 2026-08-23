import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const MANAGED_MARKER = ".miica-skills.json";

export class SkillValidationError extends Error {}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function frontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new SkillValidationError("SKILL.md must start with YAML frontmatter.");

  const readField = (field) => {
    const fieldMatch = match[1].match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
    if (!fieldMatch) throw new SkillValidationError(`SKILL.md is missing ${field}.`);
    return fieldMatch[1].trim().replace(/^(["'])(.*)\1$/, "$2");
  };

  return { name: readField("name"), description: readField("description") };
}

export async function validateSkill(skillPath, expectedName = path.basename(skillPath)) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(expectedName) || expectedName.length > 64) {
    throw new SkillValidationError(`Invalid skill name: ${expectedName}`);
  }

  const skillFile = path.join(skillPath, "SKILL.md");
  let content;
  try {
    content = await readFile(skillFile, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new SkillValidationError(`${expectedName} is missing SKILL.md.`);
    }
    throw error;
  }

  const metadata = frontmatter(content);
  if (metadata.name !== expectedName) {
    throw new SkillValidationError(
      `${expectedName} declares the name ${metadata.name}; directory and metadata names must match.`,
    );
  }
  if (!metadata.description || metadata.description.includes("TODO")) {
    throw new SkillValidationError(`${expectedName} needs a complete description.`);
  }

  const references = new Set(content.match(/references\/[A-Za-z0-9$._-]+\.md/g) ?? []);
  for (const reference of references) {
    if (!(await exists(path.join(skillPath, reference)))) {
      throw new SkillValidationError(`${expectedName} references a missing file: ${reference}`);
    }
  }

  const referencesPath = path.join(skillPath, "references");
  if (await exists(referencesPath)) {
    const entries = await readdir(referencesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const reference = `references/${entry.name}`;
      const details = await stat(path.join(referencesPath, entry.name));
      if (details.size === 0) {
        throw new SkillValidationError(`${expectedName} contains an empty reference: ${reference}`);
      }
      if (!content.includes(reference)) {
        throw new SkillValidationError(`${expectedName} does not link reference: ${reference}`);
      }
    }
  }

  return metadata;
}

export async function listCatalog(catalogRoot) {
  const entries = await readdir(catalogRoot, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const skillPath = path.join(catalogRoot, entry.name);
    const metadata = await validateSkill(skillPath, entry.name);
    skills.push({ ...metadata, path: skillPath });
  }

  return skills.sort((left, right) => left.name.localeCompare(right.name));
}

export async function isManagedSkill(skillPath) {
  try {
    const marker = JSON.parse(await readFile(path.join(skillPath, MANAGED_MARKER), "utf8"));
    return marker.package === "miica-skills" && marker.skill === path.basename(skillPath);
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) return false;
    throw error;
  }
}

async function writeMarker(skillPath, skillName, version) {
  const marker = { package: "miica-skills", skill: skillName, sourceVersion: version };
  await writeFile(path.join(skillPath, MANAGED_MARKER), `${JSON.stringify(marker, null, 2)}\n`);
}

export async function installSkill({ source, target, skillName, version, replace = false }) {
  await validateSkill(source, skillName);
  const targetExists = await exists(target);

  if (targetExists && !(await isManagedSkill(target))) {
    throw new Error(`Refusing to overwrite unmanaged skill: ${target}`);
  }
  if (targetExists && !replace) {
    throw new Error(`Skill already exists: ${target}`);
  }

  await mkdir(path.dirname(target), { recursive: true });

  if (!targetExists) {
    try {
      await cp(source, target, { recursive: true, force: false, errorOnExist: true });
      await writeMarker(target, skillName, version);
      return;
    } catch (error) {
      await rm(target, { recursive: true, force: true });
      throw error;
    }
  }

  const suffix = `${process.pid}-${Date.now()}`;
  const staged = `${target}.miica-skills-stage-${suffix}`;
  const backup = `${target}.miica-skills-backup-${suffix}`;

  try {
    await cp(source, staged, { recursive: true, force: false, errorOnExist: true });
    await writeMarker(staged, skillName, version);
    await rename(target, backup);
    await rename(staged, target);
    await rm(backup, { recursive: true, force: true });
  } catch (error) {
    await rm(staged, { recursive: true, force: true });
    if (await exists(backup)) {
      if (await exists(target)) await rm(target, { recursive: true, force: true });
      await rename(backup, target);
    }
    throw error;
  }
}

export async function removeSkill(target) {
  if (!(await exists(target))) throw new Error(`Skill is not installed: ${target}`);
  if (!(await isManagedSkill(target))) {
    throw new Error(`Refusing to remove unmanaged skill: ${target}`);
  }
  await rm(target, { recursive: true });
}

export async function pathExists(filePath) {
  return exists(filePath);
}
