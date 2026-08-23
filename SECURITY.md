# Security policy

## Report a vulnerability

Use GitHub's private vulnerability reporting for this repository. Include the affected skill or CLI command, reproduction steps, impact, and any suggested mitigation.

Do not publish credentials, exploit details, or customer data in a public issue.

## Installation boundary

The CLI validates and copies skill files. It does not execute a skill's scripts during installation. It also refuses to replace or remove a skill directory that lacks its management marker.

Agents may execute bundled scripts after installation. Review the skill and grant only the network, command, and file permissions needed for the task.
