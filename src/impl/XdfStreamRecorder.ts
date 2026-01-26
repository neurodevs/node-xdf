import { mkdir } from 'fs/promises'
import os from 'os'
import path from 'path'

import LabrecorderAdapter, {
    RecordingHandle,
    Labrecorder,
} from './LabrecorderAdapter.js'

export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor
    public static mkdir = mkdir

    protected handle?: RecordingHandle
    private labrecorder: Labrecorder
    private xdfRecordPath: string
    private streamQueries: string[]
    private hostname: string

    protected constructor(options: XdfRecorderConstructorOptions) {
        const { labrecorder, xdfRecordPath, streamQueries, hostname } = options

        this.labrecorder = labrecorder
        this.xdfRecordPath = xdfRecordPath
        this.streamQueries = streamQueries
        this.hostname = hostname

        this.throwIfPathNotXdf()
    }

    public static async Create(
        xdfRecordPath: string,
        streamQueries: string[],
        options?: XdfRecorderOptions
    ) {
        const labrecorder = this.LabrecorderAdapter()

        const { hostname = os.hostname(), makeOutputDir = true } = options ?? {}

        if (makeOutputDir) {
            await this.makeOutputDirFor(xdfRecordPath)
        }

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
            this.createRecordingHandle()
        } else {
            console.warn('Cannot start recorder because it is already running.')
        }
    }

    private createRecordingHandle() {
        this.handle = this.labrecorder.createRecording(
            this.xdfRecordPath,
            this.queriesWithHostname
        )
    }

    public get isRunning() {
        return Boolean(this.handle)
    }

    private get queriesWithHostname() {
        return this.streamQueries.map((query: string) => {
            if (query.includes('hostname=')) {
                return query
            }
            return `${query} and hostname="${this.hostname}"`
        })
    }

    public finish() {
        if (this.isRunning) {
            this.stopRecording()
            this.deleteRecording()
        } else {
            console.warn('Cannot finish recorder because it is not running.')
        }
    }

    private stopRecording() {
        this.labrecorder.stopRecording(this.handle!)
    }

    private deleteRecording() {
        this.labrecorder.deleteRecording(this.handle!)
        delete this.handle
    }

    private static async makeOutputDirFor(xdfRecordPath: string) {
        const outputDir = path.dirname(xdfRecordPath)
        await this.mkdir(outputDir, { recursive: true })
    }

    private static LabrecorderAdapter() {
        return LabrecorderAdapter.Create()
    }
}

export interface XdfRecorder {
    start(): void
    finish(): void
    isRunning: boolean
}

export interface XdfRecorderOptions {
    /**
     * The hostname to use when recording streams.
     * @default os.hostname()
     */
    hostname?: string
    /**
     * Whether to create the output directory if it does not exist.
     * @default true
     */
    makeOutputDir?: boolean
}

export type XdfRecorderConstructor = new (
    options: XdfRecorderConstructorOptions
) => XdfRecorder

export interface XdfRecorderConstructorOptions {
    labrecorder: Labrecorder
    xdfRecordPath: string
    streamQueries: string[]
    hostname: string
}
