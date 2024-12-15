import { assertOptions } from '@sprucelabs/schema'
import { open } from 'ffi-rs'

export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderAdapterConstructor
    public static ffiRsOpen = open

    private labrecorderPath: string

    protected constructor(labrecorderPath: string) {
        this.labrecorderPath = labrecorderPath

        this.ffiRsOpen({
            library: 'labrecorder',
            path: this.labrecorderPath,
        })
    }

    public static async Create(labrecorderPath: string) {
        assertOptions({ labrecorderPath }, ['labrecorderPath'])
        return new (this.Class ?? this)(labrecorderPath)
    }

    private get ffiRsOpen() {
        return LabrecorderAdapter.ffiRsOpen
    }
}

export interface Labrecorder {}

export type LabrecorderAdapterConstructor = new () => Labrecorder
