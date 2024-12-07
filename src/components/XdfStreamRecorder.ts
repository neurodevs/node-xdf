export default class XdfStreamRecorder implements StreamRecorder {
    public static Class?: StreamRecorderConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface StreamRecorder {}

export type StreamRecorderConstructor = new () => StreamRecorder
