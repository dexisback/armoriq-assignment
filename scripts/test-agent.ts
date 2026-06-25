//checks health, rules, tools, and approvals -- all in one command


const BASE =
  "http://localhost:4000";

async function main() {
  console.log(
    "Health..."
  );

  console.log(
    await fetch(
      `${BASE}/health`
    ).then(r => r.json())
  );

  console.log(
    "Rules..."
  );

  console.log(
    await fetch(
      `${BASE}/rules`
    ).then(r => r.json())
  );

  console.log(
    "Tools..."
  );

  console.log(
    await fetch(
      `${BASE}/tools`
    ).then(r => r.json())
  );

  console.log(
    "Approvals..."
  );

  console.log(
    await fetch(
      `${BASE}/approvals`
    ).then(r => r.json())
  );
}

main().catch(console.error);