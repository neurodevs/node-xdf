export default class XdfStreamRecorder implements XdfRecorder {
    public static Class?: XdfRecorderConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface XdfRecorder {}

export type XdfRecorderConstructor = new () => XdfRecorder
