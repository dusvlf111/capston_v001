import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());

const checks = [
  {
    file: "src/components/auth/LoginForm.tsx",
    snippets: ["supabase.auth.signInWithPassword", "supabase.auth.signInWithOAuth", "redirectTo"],
  },
  {
    file: "src/app/login/page.tsx",
    snippets: ["LoginForm", "redirectTo"],
  },
  {
    file: "src/app/api/auth/callback/route.ts",
    snippets: ["exchangeCodeForSession", "redirect_to"],
  },
  {
    file: "src/components/auth/LogoutButton.tsx",
    snippets: ["supabase.auth.signOut"],
  },
  {
    file: "src/components/layout/Header.tsx",
    snippets: ["LogoutButton"],
  },
];

function verify() {
  for (const check of checks) {
    const fullPath = path.join(projectRoot, check.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`Missing file: ${check.file}`);
      process.exit(1);
    }

    const content = fs.readFileSync(fullPath, "utf8");
    for (const snippet of check.snippets) {
      if (!content.includes(snippet)) {
        console.error(`Expected snippet not found in ${check.file}: ${snippet}`);
        process.exit(1);
      }
    }
  }

  console.log("Login assets verified.");
}

verify();
