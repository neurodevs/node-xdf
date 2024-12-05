import XdfReaderImpl from './components/XdfReader'

async function loadXdfFile() {
    console.log('Loading XDF file...')

    const reader = await XdfReaderImpl.Create()

    const result = await reader.load(
        '/Users/ericyates/Downloads/sttr-iacs/session_474/session_474.xdf'
    )

    result.streams.forEach((stream: any) => {
        if (!stream.time_series) {
            console.log(`${JSON.stringify(Object.keys(stream), null, 2)}`)
        }
    })

    console.log(JSON.stringify(result.events, null, 2))
}

void loadXdfFile().catch()
