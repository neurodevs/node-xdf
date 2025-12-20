import generateId from '@neurodevs/generate-id'
import { LslStreamOutlet, StreamOutlet } from '@neurodevs/node-lsl'

import XdfFileLoader, { XdfFile, XdfStream } from './XdfFileLoader.js'

export default class XdfStreamReplayer implements XdfReplayer {
    public static Class?: XdfReplayerConstructor

    private xdfFile: XdfFile
    private outlets: StreamOutlet[]
    private forMs?: number

    protected constructor(xdfFile: XdfFile, outlets: StreamOutlet[]) {
        this.xdfFile = xdfFile
        this.outlets = outlets
    }

    public static async Create(filePath: string) {
        const xdfFile = await this.loadXdfFile(filePath)
        const outlets = await this.createStreamOutlets(xdfFile)

        return new (this.Class ?? this)(xdfFile, outlets)
    }

    public async replay(forMs?: number) {
        this.forMs = forMs
        await Promise.all(this.streamReplayTasks)
    }

    private get streamReplayTasks() {
        return this.streams.map(
            async (stream, streamIdx) => await this.replayFor(stream, streamIdx)
        )
    }

    private async replayFor(stream: XdfStream, streamIdx: number) {
        const samples = this.generateSamplesFrom(stream)
        const outlet = this.outlets[streamIdx]
        const msBetweenSamples = 1000 / stream.nominalSampleRateHz

        let elapsedMs = 0

        for (const sample of samples) {
            outlet.pushSample(sample)
            await this.waitFor(msBetweenSamples)
            elapsedMs += msBetweenSamples

            if (this.forMs && elapsedMs >= this.forMs) {
                break
            }
        }
    }

    private generateSamplesFrom(stream: XdfStream) {
        const firstChannelLength = stream.data?.[0]?.length

        return Array.from({ length: firstChannelLength }, (_, i) =>
            stream.data.map((channel) => channel[i])
        )
    }

    private async waitFor(ms: number) {
        await new Promise((resolve) => setTimeout(resolve, ms))
    }

    private get streams() {
        return this.xdfFile.streams
    }

    private static async loadXdfFile(filePath: string) {
        const loader = await XdfFileLoader.Create()
        return await loader.load(filePath)
    }

    private static createStreamOutlets(xdfFile: XdfFile) {
        const { streams } = xdfFile
        return Promise.all(streams.map((stream) => this.StreamOutlet(stream)))
    }

    private static async StreamOutlet(stream: XdfStream) {
        const { type, nominalSampleRateHz } = stream

        return await LslStreamOutlet.Create({
            type,
            sampleRateHz: nominalSampleRateHz,
            channelNames: Array.from(
                { length: stream.channelCount },
                (_, i) => `${type}_channel_${i}`
            ),
            name: type,
            sourceId: type,
            manufacturer: generateId(),
            units: generateId(),
            channelFormat: 'float32',
            chunkSize: 1,
            maxBufferedMs: 0,
        })
    }
}

export interface XdfReplayer {
    replay(forMs?: number): Promise<void>
}

export type XdfReplayerConstructor = new (
    xdfFile: XdfFile,
    outlets: StreamOutlet[]
) => XdfReplayer
