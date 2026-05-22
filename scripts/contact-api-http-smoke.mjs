import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const port = 3015;
const baseUrl = `http://127.0.0.1:${port}`;

function readEnvValue(name) {
  const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);
  const line = lines.find((entry) => entry.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : "";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopServer(server) {
  if (server.exitCode !== null) {
    return;
  }

  await new Promise((resolve) => {
    const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    killer.on("exit", resolve);
    killer.on("error", resolve);
  });
}

async function waitForServer(server) {
  const startedAt = Date.now();
  let output = "";

  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  while (Date.now() - startedAt < 90000) {
    if (server.exitCode !== null) {
      throw new Error(`Next dev server exited early:\n${output}`);
    }

    if (output.includes("Ready")) {
      return;
    }

    await wait(1000);
  }

  throw new Error(`Next dev server did not start in time:\n${output}`);
}

async function postContact(body) {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  return { status: response.status, result };
}

async function main() {
  const receiverEmail = readEnvValue("CONTACT_RECEIVER_EMAIL");

  if (!receiverEmail) {
    throw new Error("Missing environment variable: CONTACT_RECEIVER_EMAIL");
  }

  const server = spawn("cmd.exe", ["/c", "npx", "next", "dev", "--webpack", "-p", String(port)], {
    env: {
      ...process.env,
      NODE_ENV: "development",
      NODE_OPTIONS: "--max-old-space-size=4096",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(server);

    const checks = [
      ["empty", {}],
      [
        "invalid-email",
        {
          fullName: "Codex Smoke Test",
          email: "not-an-email",
          phone: "",
          organization: "",
          inquiryType: "general",
          message: "This is a smoke test message.",
          website: "",
        },
      ],
      [
        "valid",
        {
          fullName: "Codex Smoke Test",
          email: receiverEmail,
          phone: "",
          organization: "Wilcom smoke test",
          inquiryType: "general",
          message: "This is a contact API smoke test generated after fixing the contact route.",
          website: "",
        },
      ],
    ];

    for (const [name, body] of checks) {
      const { status, result } = await postContact(body);
      console.log(`${name}: ${status} ${JSON.stringify(result)}`);
    }
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error("CONTACT_HTTP_SMOKE_TEST_ERROR:", error);
  process.exit(1);
});
