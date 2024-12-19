import { assertOptions } from '@sprucelabs/schema'
import { generateId } from '@sprucelabs/test-utils'
import { LslOutletImpl } from '@neurodevs/node-lsl'
import XdfFileLoader, { XdfStream } from './XdfFileLoader'

export default class XdfStreamReplayer implements XdfReplayer {
    public static Class?: XdfReplayerConstructor

    protected constructor() {}

    public static async Create(filePath: string) {
        assertOptions({ filePath }, ['filePath'])

        const loader = await XdfFileLoader.Create()
        const { streams } = await loader.load(filePath)

        for (const stream of streams) {
            await this.LslOutlet(stream)
        }

        return new (this.Class ?? this)()
    }

    public async replay() {}

    private static async LslOutlet(stream: XdfStream) {
        const { type, nominalSampleRateHz } = stream

        await LslOutletImpl.Create({
            type,
            sampleRate: nominalSampleRateHz,
            channelNames: [],
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
