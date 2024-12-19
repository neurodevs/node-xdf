import { assertOptions } from '@sprucelabs/schema'
import XdfFileLoader from './XdfFileLoader'

export default class XdfStreamReplayer implements XdfReplayer {
    public static Class?: XdfReplayerConstructor

    protected constructor() {}

    public static async Create(filePath: string) {
        assertOptions({ filePath }, ['filePath'])

        const loader = await XdfFileLoader.Create()
        await loader.load(filePath)

        return new (this.Class ?? this)()
    }

    public async replay(streamQueries: string[]) {
        assertOptions({ streamQueries }, ['streamQueries'])
    }
}

export interface XdfReplayer {
    replay(streamQueries: string[]): Promise<void>
}

export type XdfReplayerConstructor = new () => XdfReplayer
