export default class XdfRecorder implements XdfFileRecorder {
    public static Class?: XdfFileRecorderConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface XdfFileRecorder {}

export type XdfFileRecorderConstructor = new () => XdfFileRecorder
