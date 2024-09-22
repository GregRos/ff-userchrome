import { AsciiTable3 } from "ascii-table3"
import chalk from "chalk"
import { spawn } from "child_process"
import { writeFileSync } from "fs"
import { compile } from "sass"
const profileFolder =
    process.argv[2] ??
    String.raw`C:\Users\Greg\AppData\Roaming\Mozilla\Firefox\Profiles\mhdpe0sx.dev-edition-default`

if (!profileFolder) {
    throw new Error("No profile folder provided")
}
console.log(chalk.red("Profile folder: "), chalk.blue(profileFolder))
const sassFile = `${__dirname}/userChrome.scss`
const dest = `${profileFolder}/chrome/userChrome.css`
console.log(
    "Compiles the userChrome.scss file into a Firefox userChrome.css file and watches for changes"
)
const table = new AsciiTable3("Inputs")
    .addRowMatrix(
        [
            ["Profile", profileFolder],
            ["SCSS", sassFile]
        ].map(([a, b]) => [chalk.red(a), chalk.blue(b)])
    )
    .addStyle({
        name: "none"
    } as any)

console.log(table.toString())
console.log(chalk.red("Dest:"), chalk.blue(dest))

// running first compile manually to catch errors and do it fast (watch is slow fsr)
// log
console.log(chalk.red("Compiling for the first time..."))
const result = compile(sassFile)
writeFileSync(dest, result.css)
console.log(chalk.red("First compile done!"))
console.log(chalk.red("Watching for changes..."))
spawn(`npx sass --watch ${sassFile}:${dest}`, {
    shell: true,
    stdio: "inherit"
}).on("spawn", () => {
    console.log(chalk.green("* Spawn event fired"))
})
console.log(chalk.green("* Node.js spawn returned"))
