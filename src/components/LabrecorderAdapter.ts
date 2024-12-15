import { assertOptions } from '@sprucelabs/schema'

export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderAdapterConstructor

    protected constructor() {}

    public static Create(labrecorderPath: string) {
        assertOptions({ labrecorderPath }, ['labrecorderPath'])
        return new (this.Class ?? this)()
    }
}

export interface Labrecorder {}

export type LabrecorderAdapterConstructor = new () => Labrecorder
