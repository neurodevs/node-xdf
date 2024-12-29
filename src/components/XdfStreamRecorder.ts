import { assertOptions } from '@sprucelabs/schema'
import SpruceError from '../errors/SpruceError'
import LabrecorderAdapter, {
    BoundRecording,
    Labrecorder,
} from './LabrecorderAdapter'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    protected recording: BoundRecording
    private labrecorder: Labrecorder
    private xdfSavePath: string
    private streamQueries: string[]

    protected constructor(options: XdfRecorderOptions) {
        const { labrecorder, xdfSavePath: savePath, streamQueries } = options

        this.labrecorder = labrecorder
        this.xdfSavePath = savePath
        this.streamQueries = streamQueries

        this.throwIfSavePathNotXdf()
    }

    public static Create(xdfSavePath: string, streamQueries: any) {
        assertOptions({ xdfSavePath, streamQueries }, [
            'xdfSavePath',
            'streamQueries',
        ])

        const labrecorder = this.LabrecorderAdapter()

        return new (this.Class ?? this)({
            labrecorder,
            xdfSavePath,
            streamQueries,
        })
    }

    private throwIfSavePathNotXdf() {
        if (!this.hasXdfFileExtension) {
            throw new SpruceError({
                code: 'INVALID_FILE_EXTENSION',
                xdfSavePath: this.xdfSavePath,
            })
        }
    }

    public start() {
        this.recording = this.createRecordingInstance()
    }

    private createRecordingInstance() {
        return this.labrecorder.createRecording(
            this.xdfSavePath,
            this.streamQueries
        )
    }

    public stop() {
        this.deleteRecordingInstance()
    }

    private deleteRecordingInstance() {
        this.labrecorder.deleteRecording(this.recording)
    }

    private get hasXdfFileExtension() {
        return this.xdfSavePath.endsWith('.xdf')
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
    xdfSavePath: string
    streamQueries: any
}
