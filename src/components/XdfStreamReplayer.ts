export default class XdfStreamReplayer implements XdfReplayer {
    public static Class?: XdfReplayerConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface XdfReplayer {}

export type XdfReplayerConstructor = new () => XdfReplayer
