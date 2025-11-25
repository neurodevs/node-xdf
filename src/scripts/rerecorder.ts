import XdfStreamRecorder from '../impl/XdfStreamRecorder.js'
import XdfStreamReplayer from '../impl/XdfStreamReplayer.js'

async function rerecord() {
    console.log('Starting recording...')

    const recorder = await XdfStreamRecorder.Create(
        '/Users/ericthecurious/Downloads/test.xdf',
        ['type="EEG"', 'type="PPG"']
    )

    console.log('Recording instance created!')

    recorder.start()

    console.log('Started recording!')
    console.log('Replaying...')

    const replayer = await XdfStreamReplayer.Create(
        '/Users/ericthecurious/Downloads/test-10sec.xdf'
    )

    await replayer.replay()

    await new Promise((resolve) => setTimeout(resolve, 10000))

    console.log('Finishing recorder...')

    recorder.finish()

    console.log('Finished!')
}

void rerecord().catch()
