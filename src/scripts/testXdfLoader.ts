import { execSync } from 'node:child_process'

import XdfFileLoader from '../impl/XdfFileLoader.js'

async function logResourceUsage(label: string) {
    try {
        const pid = process.pid
        const openFiles = execSync(`lsof -p ${pid} | wc -l`).toString().trim()
        console.log(`${label}: ${openFiles} open file descriptors`)
    } catch (err) {
        console.warn(`Could not inspect resources at ${label}:`, err)
    }
}

async function runXdfLoaderTest() {
    const filePath = '/Users/ericthecurious/Downloads/session_2330.xdf'
    console.log(`Testing with file: ${filePath}\n`)

    await logResourceUsage('Before Create')

    const loader = await XdfFileLoader.Create()

    await logResourceUsage('After Create')

    const file = await loader.load(filePath, { timeoutMs: 0 })

    console.log(
        `Loaded file with ${file.streams.length} streams and ${file.events.length} events.`
    )

    await logResourceUsage('After Load')

    console.log(
        '\nTest complete. Manually inspect whether any threads or descriptors persist.'
    )
}

runXdfLoaderTest().catch((err) => {
    console.error('Test failed:', err)
})
