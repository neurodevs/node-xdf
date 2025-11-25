import fs from 'fs'
import os from 'os'
import path from 'path'

import LabrecorderAdapter, {
    BoundRecording,
    Labrecorder,
} from './LabrecorderAdapter.js'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor
    public static mkdir = fs.mkdirSync

    protected recording: BoundRecording
    private labrecorder: Labrecorder
    private xdfRecordPath: string
    private streamQueries: string[]
    private hostname: string

    protected constructor(options: XdfRecorderOptions) {
        const { labrecorder, xdfRecordPath, streamQueries, hostname } = options

        this.labrecorder = labrecorder
        this.xdfRecordPath = xdfRecordPath
        this.streamQueries = streamQueries
        this.hostname = hostname ?? os.hostname()

        this.throwIfPathNotXdf()
    }

    public static Create(
        xdfRecordPath: string,
        streamQueries: any,
        options?: CreateRecorderOptions
    ) {
        const labrecorder = this.LabrecorderAdapter()
        const { hostname } = options ?? {}

        return new (this.Class ?? this)({
            labrecorder,
            xdfRecordPath,
            streamQueries,
            hostname,
        })
    }

    private throwIfPathNotXdf() {
        if (!this.hasXdfFileExtension) {
            throw new Error(this.invalidExtensionMessage)
        }
    }

    private get hasXdfFileExtension() {
        return this.fileExtension === '.xdf'
    }

    private get fileExtension() {
        return path.extname(this.xdfRecordPath)
    }

    private get invalidExtensionMessage() {
        return `Invalid file extension! Must end in .xdf, not ${this.fileExtension} \n`
    }

    public start() {
        if (!this.isRunning) {
            this.createDirsRecursively()
            this.createRecordingInstance()
        }
    }

    private createDirsRecursively() {
        this.mkdir(this.recordingDir, {
            recursive: true,
        })
    }

    private get recordingDir() {
        return path.dirname(this.xdfRecordPath)
    }

    private get mkdir() {
        return XdfStreamRecorder.mkdir
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

    public stop() {
        if (this.isRunning) {
            this.deleteRecordingInstance()
        }
    }

    private deleteRecordingInstance() {
        this.labrecorder.deleteRecording(this.recording)
        delete this.recording
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
    hostname?: string
}

export interface CreateRecorderOptions {
    hostname?: string
}
