import { doddle } from "doddle"
import { initCompiler } from "sass"
const sassCompiler = doddle(() => {
    const sass = initCompiler()
    return sass
})
export function compile(css: string) {
    const sass = sassCompiler.pull()
    return sass.compile(css)
}
