import { assertOptions } from '@sprucelabs/schema'
import { DataType, define, open } from 'ffi-rs'

export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderAdapterConstructor
    public static ffiRsOpen = open
    public static ffiRsDefine = define

    private labrecorderPath: string

    protected constructor(labrecorderPath: string) {
        this.labrecorderPath = labrecorderPath

        this.loadLibrary()
        this.registerFunctions()
    }

    public static async Create(labrecorderPath: string) {
        assertOptions({ labrecorderPath }, ['labrecorderPath'])
        return new (this.Class ?? this)(labrecorderPath)
    }

    private loadLibrary() {
        this.ffiRsOpen({
            library: 'labrecorder',
            path: this.labrecorderPath,
        })
    }

    private registerFunctions() {
        this.ffiRsDefine({
            recording_create: {
                library: 'labrecorder',
                retType: DataType.External, // Pointer to the recording object
                paramsType: [
                    DataType.String, //    filename
                    DataType.External, //  streams
                    DataType.External, //  watchfor
                    DataType.External, //  syncOptions
                    DataType.Boolean, //   collect_offsets
                ],
            },
            recording_stop: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [
                    DataType.External, // Pointer to the recording object
                ],
            },
            recording_delete: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [DataType.External],
            },
        })
    }

    private get ffiRsOpen() {
        return LabrecorderAdapter.ffiRsOpen
    }

    private get ffiRsDefine() {
        return LabrecorderAdapter.ffiRsDefine
    }
}

export interface Labrecorder {}

export type LabrecorderAdapterConstructor = new () => Labrecorder
