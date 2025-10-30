import XdfFileLoader from '../impl/XdfFileLoader.js'

async function loadXdfFile() {
    console.log('Loading XDF file...')

    const loader = await XdfFileLoader.Create()

    console.log('Loader instance created!')

    const result = await loader.load(
        '/Users/ericthecurious/dev/node-biosensors/muse.xdf'
    )

    console.log('Finished loading XDF file!')

    result.streams.forEach((stream: any) => {
        console.log(
            'Stream type:',
            stream.type,
            stream.name,
            stream?.data?.[0].length
        )
        // console.log(JSON.stringify(Object.keys(stream), null, 2))
    })

    // result.streams.forEach((stream: any) => {
    //     if (!stream.time_series) {
    //         console.log(`${JSON.stringify(Object.keys(stream), null, 2)}`)
    //     }
    // })

    // console.log(JSON.stringify(result.events, null, 2))
}

void loadXdfFile().catch()
