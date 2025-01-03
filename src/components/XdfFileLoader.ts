import { assertOptions } from '@sprucelabs/schema'
import LibxdfAdapter, { Libxdf } from '../adapters/LibxdfAdapter'
import SpruceError from '../errors/SpruceError'

export default class XdfFileLoader implements XdfLoader {
    public static Class?: XdfLoaderConstructor
    private static readonly libxdfPath = '/opt/local/lib/libxdf.dylib'

    private filePath!: string
    private timeoutMs!: number

    private readonly libxdf: Libxdf

    protected constructor(libxdf: Libxdf) {
        this.libxdf = libxdf
    }

    public static async Create(libxdfPath = this.libxdfPath) {
        const throwIfLibxdfDoesNotExist = this.Class ? false : true

        const libxdf = await LibxdfAdapter.Create(
            libxdfPath,
            throwIfLibxdfDoesNotExist
        )

        return new (this.Class ?? this)(libxdf)
    }

    public async load(filePath: string, options?: XdfLoaderLoadOptions) {
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

export interface XdfLoader {
    load(filePath: string, options?: XdfLoaderLoadOptions): Promise<XdfFile>
}

export type XdfLoaderConstructor = new (
    libxdf: Libxdf,
    options?: XdfLoaderConstructorOptions
) => XdfLoader

export interface XdfLoaderConstructorOptions {
    throwIfLibxdfDoesNotExist?: boolean
}

export interface XdfLoaderLoadOptions {
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
