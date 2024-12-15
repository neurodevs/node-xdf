export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderAdapterConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface Labrecorder {}

export type LabrecorderAdapterConstructor = new () => Labrecorder
