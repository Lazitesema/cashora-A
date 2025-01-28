const { execSync } = require("child_process")

console.log("Installing dependencies for Cashora project...")

const dependencies = [
  "next",
  "react",
  "react-dom",
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "@radix-ui/react-slot",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-dialog",
  "@radix-ui/react-toast",
  "@radix-ui/react-label",
  "@radix-ui/react-select",
  "@radix-ui/react-checkbox",
  "@radix-ui/react-avatar",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-switch",
  "@radix-ui/react-tabs",
  "class-variance-authority",
  "clsx",
  "lucide-react",
  "@supabase/supabase-js",
  "@supabase/auth-helpers-nextjs",
  "date-fns",
  "recharts",
  "next-themes",
  "zod",
  "react-hook-form",
  "@hookform/resolvers",
]

const devDependencies = [
  "typescript",
  "@types/react",
  "@types/react-dom",
  "@types/node",
  "eslint",
  "eslint-config-next",
  "supabase",
  "encoding",
]

try {
  console.log("Installing production dependencies...")
  execSync(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" })

  console.log("\nInstalling development dependencies...")
  execSync(`npm install -D ${devDependencies.join(" ")}`, { stdio: "inherit" })

  console.log(
    "\nAll dependencies, including Supabase Auth Helpers and form libraries, have been successfully installed!",
  )
} catch (error) {
  console.error("An error occurred while installing dependencies:", error)
}

