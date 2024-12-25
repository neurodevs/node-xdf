import { assertOptions } from '@sprucelabs/schema'
import LabrecorderAdapter, {
    BoundRecording,
    Labrecorder,
} from './LabrecorderAdapter'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    protected recording: BoundRecording
    private labrecorder: Labrecorder
    private savePath: string
    private streamQueries: string[]

    protected constructor(options: XdfRecorderOptions) {
        const { labrecorder, savePath, streamQueries } = options

        this.labrecorder = labrecorder
        this.savePath = savePath
        this.streamQueries = streamQueries
    }

    public static Create(recordingPath: string, streamQueries: any) {
        assertOptions({ recordingPath, streamQueries }, [
            'recordingPath',
            'streamQueries',
        ])

        const labrecorder = this.LabrecorderAdapter()

        return new (this.Class ?? this)({
            labrecorder,
            savePath: recordingPath,
            streamQueries,
        })
    }

    public start() {
        this.recording = this.createRecordingInstance()
    }

    public stop() {
        this.deleteRecordingInstance()
    }

    private createRecordingInstance() {
        return this.labrecorder.createRecording(
            this.savePath,
            this.streamQueries
        )
    }

    private deleteRecordingInstance() {
        this.labrecorder.deleteRecording(this.recording)
    }

    private static LabrecorderAdapter() {
        return LabrecorderAdapter.Create()
    }
}

export interface XdfRecorder {
    start(): void
    stop(): void
}

export type XdfRecorderConstructor = new (
    options: XdfRecorderOptions
) => XdfRecorder

export interface XdfRecorderOptions {
    labrecorder: Labrecorder
    savePath: string
    streamQueries: any
}
