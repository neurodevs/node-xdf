import { assertOptions } from '@sprucelabs/schema'
import { generateId } from '@sprucelabs/test-utils'
import { LslOutlet, LslOutletImpl } from '@neurodevs/node-lsl'
import XdfFileLoader, { XdfFile, XdfStream } from './XdfFileLoader'

export default class XdfStreamReplayer implements XdfReplayer {
    public static Class?: XdfReplayerConstructor

    private xdfFile: XdfFile
    private outlets: LslOutlet[]

    protected constructor(xdfFile: XdfFile, outlets: LslOutlet[]) {
        this.xdfFile = xdfFile
        this.outlets = outlets
    }

    public static async Create(filePath: string) {
        assertOptions({ filePath }, ['filePath'])

        const xdfFile = await this.loadXdfFile(filePath)
        const outlets = await this.createLslOutlets(xdfFile)

        return new (this.Class ?? this)(xdfFile, outlets)
    }

    public async replay() {
        await Promise.all(this.streamReplayTasks)
    }

    private get streamReplayTasks() {
        return this.streams.map((stream, streamIdx) =>
            this.replayFor(stream, streamIdx)
        )
    }

    private replayFor(stream: XdfStream, streamIdx: number) {
        const samples = this.generateSamplesFrom(stream)

        return samples.map((sample) =>
            this.outlets[streamIdx].pushSample(sample)
        )
    }

    private generateSamplesFrom(stream: XdfStream) {
        const firstChannelLength = stream.data[0]?.length

        return Array.from({ length: firstChannelLength }, (_, i) =>
            stream.data.map((channel) => channel[i])
        )
    }

    private get streams() {
        return this.xdfFile.streams
    }

    private static async loadXdfFile(filePath: string) {
        const loader = await XdfFileLoader.Create()
        return await loader.load(filePath)
    }

    private static createLslOutlets(xdfFile: XdfFile) {
        const { streams } = xdfFile
        return Promise.all(streams.map((stream) => this.LslOutlet(stream)))
    }

    private static async LslOutlet(stream: XdfStream) {
        const { type, nominalSampleRateHz } = stream

        return await LslOutletImpl.Create({
            type,
            sampleRate: nominalSampleRateHz,
            channelNames: [generateId()],
            name: generateId(),
            sourceId: generateId(),
            manufacturer: generateId(),
            unit: generateId(),
            channelFormat: 'float32',
            chunkSize: 1,
            maxBuffered: 0,
        })
    }
}

export interface XdfReplayer {
    replay(): Promise<void>
}

export type XdfReplayerConstructor = new () => XdfReplayer
