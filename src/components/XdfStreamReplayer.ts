import { assertOptions } from '@sprucelabs/schema'
import XdfFileLoader from './XdfFileLoader'

export default class XdfStreamReplayer implements XdfReplayer {
    public static Class?: XdfReplayerConstructor

    protected constructor() {}

    public static async Create(filePath: string) {
        assertOptions({ filePath }, ['filePath'])

        await XdfFileLoader.Create()

        return new (this.Class ?? this)()
    }
}

export interface XdfReplayer {}

export type XdfReplayerConstructor = new () => XdfReplayer
