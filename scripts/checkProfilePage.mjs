import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());

const checks = [
  {
    file: "src/app/profile/page.tsx",
    snippets: [".from(\"profiles\")", ".select(\"id, user_id, full_name, phone, emergency_contact\")", "ProfileForm", "redirect(\"/login?redirectTo=/profile\")"],
  },
  {
    file: "src/components/profile/ProfileForm.tsx",
    snippets: ["supabase", ".from(\"profiles\")", ".update({", "fullName", "emergencyContact"],
  },
  {
    file: "middleware.ts",
    snippets: ["'/profile'"],
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

  console.log("Profile page assets verified.");
}

verify();
