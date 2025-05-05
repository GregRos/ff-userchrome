import { AsciiTable3 } from "ascii-table3"
import chalk from "chalk"
import { spawn } from "child_process"
import { seq } from "doddle"
import { mkdirSync, statSync, writeFileSync } from "fs"
import { glob } from "glob"
import { compile } from "sass"
const userProfile = process.env.USERPROFILE
function getMozProfile(userProfile: string) {
    const profilesRoot = `${userProfile}\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles`
    // find a profile folder ending with dev-edition-default
    const profileFolders = glob.sync(`${profilesRoot}\\*dev-edition-default*`.replaceAll("\\", "/"))
    // pick the folder with the latest date
    // if there are multiple folders, the first one is picked
    return seq(profileFolders)
        .maxBy(folder => {
            const stats = statSync(folder)
            return stats.mtime
        })
        .pull()
}
const profileFolder = getMozProfile(userProfile!)
if (!profileFolder) {
    throw new Error("No profile folder provided")
}
console.log(chalk.red("Profile folder: "), chalk.blue(profileFolder))
const sassFile = `${__dirname}/userChrome.scss`
mkdirSync(`${profileFolder}/chrome`, {
    recursive: true
})
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
