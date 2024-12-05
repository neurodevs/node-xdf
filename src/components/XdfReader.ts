import { assertOptions } from '@sprucelabs/schema'
import SpruceError from '../errors/SpruceError'
import LibxdfImpl, { Libxdf } from './Libxdf'

export default class XdfReaderImpl implements XdfReader {
    public static Class?: XdfReaderConstructor
    private static readonly libxdfPath = '/opt/local/lib/libxdf.dylib'

    private filePath!: string
    private timeoutMs!: number

    private readonly libxdf: Libxdf

    protected constructor(libxdf: Libxdf) {
        this.libxdf = libxdf
    }

    public static async Create(
        libxdfPath = this.libxdfPath,
        options?: XdfReaderOptions
    ) {
        const { throwIfLibxdfDoesNotExist = true } = options ?? {}

        const libxdf = await LibxdfImpl.Create(
            libxdfPath,
            throwIfLibxdfDoesNotExist
        )

        return new (this.Class ?? this)(libxdf)
    }

    public async load(filePath: string, options?: XdfReaderLoadOptions) {
        assertOptions({ filePath }, ['filePath'])
        const { timeoutMs = 0 } = options ?? {}

        this.filePath = filePath
        this.timeoutMs = timeoutMs

        this.assertValidTimeout()

        return this.loadXdf()
    }

    protected assertValidTimeout() {
        if (this.timeoutMs < 0) {
            throw new SpruceError({
                code: 'INVALID_TIMEOUT_MS',
                timeoutMs: this.timeoutMs,
            })
        }
    }

    private loadXdf() {
        return this.libxdf.loadXdf(this.filePath)
    }

    protected async wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

export interface XdfReader {
    load(filePath: string, options?: XdfReaderLoadOptions): Promise<XdfFile>
}

export type XdfReaderConstructor = new (
    libxdf: Libxdf,
    options?: XdfReaderOptions
) => XdfReader

export interface XdfReaderOptions {
    throwIfLibxdfDoesNotExist?: boolean
}

export interface XdfReaderLoadOptions {
    timeoutMs?: number
}

export interface XdfFile {
    path: string
    streams: XdfStream[]
    events: XdfEvent[]
}

export interface XdfStream {
    id: number
    name: string
    type: string
    channelCount: number
    channelFormat: string
    nominalSampleRateHz: number
    data: number[][]
    timestamps: number[]
}

export interface XdfEvent {
    name: string
    timestamp: number
    streamId: number
}
