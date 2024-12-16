import { DataType, define, open } from 'ffi-rs'

export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderConstructor
    public static ffiRsOpen = open
    public static ffiRsDefine = define

    private labrecorderPath: string
    private bindings!: LabrecorderBindings

    protected constructor(labrecorderPath: string) {
        this.labrecorderPath = labrecorderPath

        this.loadLibrary()
        this.registerFunctions()
    }

    public static Create(labrecorderPath?: string) {
        const path = labrecorderPath ?? '/opt/local/lib/liblabrecorder.dylib'
        return new (this.Class ?? this)(path)
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
                retType: this.RecordingInstanceType,
                paramsType: [this.FilenameType, this.WatchForType],
            },
        }
    }

    private get recordingStopFunction() {
        return {
            recording_stop: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [this.RecordingInstanceType],
            },
        }
    }

    private get recordingDeleteFunction() {
        return {
            recording_delete: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [this.RecordingInstanceType],
            },
        }
    }

    private get ffiRsOpen() {
        return LabrecorderAdapter.ffiRsOpen
    }

    private get ffiRsDefine() {
        return LabrecorderAdapter.ffiRsDefine
    }

    private readonly FilenameType = DataType.String
    private readonly WatchForType = DataType.StringArray
    private readonly RecordingInstanceType = DataType.External
}

export interface Labrecorder {
    createRecording(filename: string, watchFor: string[]): BoundRecording
}

export type LabrecorderConstructor = new (
    labrecorderPath: string
) => Labrecorder

export interface LabrecorderBindings {
    recording_create(args: [string, string[]]): BoundRecording
    recording_stop(args: [BoundRecording]): void
    recording_delete(args: [BoundRecording]): void
}

export type BoundRecording = any
