import os from 'os'
import { assertOptions } from '@sprucelabs/schema'
import LabrecorderAdapter, {
    BoundRecording,
    Labrecorder,
} from '../adapters/LabrecorderAdapter'
import SpruceError from '../errors/SpruceError'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    protected recording: BoundRecording
    private labrecorder: Labrecorder
    private xdfRecordPath: string
    private streamQueries: string[]

    protected constructor(options: XdfRecorderOptions) {
        const { labrecorder, xdfRecordPath, streamQueries } = options

        this.labrecorder = labrecorder
        this.xdfRecordPath = xdfRecordPath
        this.streamQueries = streamQueries

        this.throwIfPathNotXdf()
    }

    public static Create(xdfRecordPath: string, streamQueries: any) {
        assertOptions({ xdfRecordPath, streamQueries }, [
            'xdfRecordPath',
            'streamQueries',
        ])

        const labrecorder = this.LabrecorderAdapter()

        return new (this.Class ?? this)({
            labrecorder,
            xdfRecordPath,
            streamQueries,
        })
    }

    private throwIfPathNotXdf() {
        if (!this.hasXdfFileExtension) {
            throw new SpruceError({
                code: 'INVALID_FILE_EXTENSION',
                xdfRecordPath: this.xdfRecordPath,
            })
        }
    }

    public start() {
        if (!this.isRunning) {
            this.createRecordingInstance()
        }
    }

    private createRecordingInstance() {
        this.recording = this.labrecorder.createRecording(
            this.xdfRecordPath,
            this.queriesWithHostname
        )
    }

    public get isRunning() {
        return Boolean(this.recording)
    }

    private get queriesWithHostname() {
        return this.streamQueries.map((query: string) => {
            return `${query} and hostname="${this.hostname}"`
        })
    }

    private readonly hostname = os.hostname()

    public stop() {
        if (this.isRunning) {
            this.deleteRecordingInstance()
        }
    }

    private deleteRecordingInstance() {
        this.labrecorder.deleteRecording(this.recording)
        delete this.recording
    }

    private get hasXdfFileExtension() {
        return this.xdfRecordPath.endsWith('.xdf')
    }

    private static LabrecorderAdapter() {
        return LabrecorderAdapter.Create()
    }
}

export interface XdfRecorder {
    start(): void
    stop(): void
    isRunning: boolean
}

export type XdfRecorderConstructor = new (
    options: XdfRecorderOptions
) => XdfRecorder

export interface XdfRecorderOptions {
    labrecorder: Labrecorder
    xdfRecordPath: string
    streamQueries: any
}
