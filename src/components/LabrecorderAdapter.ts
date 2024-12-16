import { assertOptions } from '@sprucelabs/schema'
import { DataType, define, open } from 'ffi-rs'

export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderAdapterConstructor
    public static ffiRsOpen = open
    public static ffiRsDefine = define

    private labrecorderPath: string
    private bindings!: LabrecorderBindings

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
        this.ffiRsOpen(this.libraryOptions)
    }

    private registerFunctions() {
        this.bindings = this.ffiRsDefine(this.functions)
    }

    public createRecording(filename: string, watchFor: string[]) {
        return this.bindings.recording_create([filename, watchFor])
    }

    private get libraryOptions() {
        return {
            library: 'labrecorder',
            path: this.labrecorderPath,
        }
    }

    private get functions() {
        return {
            ...this.recordingCreateFunction,
            ...this.recordingStopFunction,
            ...this.recordingDeleteFunction,
        }
    }

    private get recordingCreateFunction() {
        return {
            recording_create: {
                library: 'labrecorder',
                retType: DataType.External, // Pointer to the recording object
                paramsType: [
                    DataType.String, // filename
                    DataType.StringArray, // watchfor
                ],
            },
        }
    }

    private get recordingStopFunction() {
        return {
            recording_stop: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [
                    DataType.External, // Pointer to the recording object
                ],
            },
        }
    }

    private get recordingDeleteFunction() {
        return {
            recording_delete: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [DataType.External], // Pointer to the recording object
            },
        }
    }

    private get ffiRsOpen() {
        return LabrecorderAdapter.ffiRsOpen
    }

    private get ffiRsDefine() {
        return LabrecorderAdapter.ffiRsDefine
    }
}

export interface Labrecorder {
    createRecording(filename: string, watchFor: string[]): BoundRecording
}

export type LabrecorderAdapterConstructor = new (
    labrecorderPath: string
) => Labrecorder

export interface LabrecorderBindings {
    recording_create(args: [string, string[]]): BoundRecording
    recording_stop(args: [BoundRecording]): void
    recording_delete(args: [BoundRecording]): void
}

export type BoundRecording = any
