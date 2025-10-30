import XdfStreamReplayer from '../impl/XdfStreamReplayer.js'

async function replayXdfFile() {
    console.log('Replaying XDF file...')

    const instance = await XdfStreamReplayer.Create(
        '/Users/ericthecurious/Downloads/session_15.xdf'
    )

    await instance.replay(5000)
}

void replayXdfFile().catch((err) => console.error(err))
