import { assertOptions } from '@sprucelabs/schema'
import LabrecorderAdapter, { Labrecorder } from './LabrecorderAdapter'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    private labrecorder: Labrecorder
    private recordingPath: string
    private streamQueries: any

    protected constructor(options: XdfRecorderOptions) {
        const { labrecorder, recordingPath, streamQueries } = options

        this.labrecorder = labrecorder
        this.recordingPath = recordingPath
        this.streamQueries = streamQueries
    }

    public static Create(recordingPath: string, streamQueries: any) {
        assertOptions({ recordingPath, streamQueries }, [
            'recordingPath',
            'streamQueries',
        ])

        const labrecorder = LabrecorderAdapter.Create()

        return new (this.Class ?? this)({
            labrecorder,
            recordingPath,
            streamQueries,
        })
    }

    public start() {
        this.createLabrecorderRecording()
    }

    private createLabrecorderRecording() {
        this.labrecorder.createRecording(this.recordingPath, this.streamQueries)
    }
}

export interface XdfRecorder {
    start(): void
}

export type XdfRecorderConstructor = new (
    options: XdfRecorderOptions
) => XdfRecorder

export interface XdfRecorderOptions {
    labrecorder: Labrecorder
    recordingPath: string
    streamQueries: any
}
