import LabrecorderAdapter from './components/LabrecorderAdapter'

export async function startRecording() {
    console.log('Starting recording...')

    const adapter = await LabrecorderAdapter.Create(
        '/opt/local/lib/liblabrecorder.dylib'
    )

    adapter.createRecording('test.xdf', [
        'type=EEG',
        'type=PPG',
        'type=markers',
    ])

    console.log('Recording started!')
}

startRecording().catch((err) => console.error('Error:', err))
