import { DataType, define, open } from 'ffi-rs'

export default class LabrecorderAdapter implements Labrecorder {
    public static Class?: LabrecorderConstructor
    public static ffiRsOpen = open
    public static ffiRsDefine = define

    private labrecorderPath: string
    private bindings!: LabrecorderBindings
    private filename!: string
    private watchFor!: string[]
    private recording!: BoundRecording

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
        this.bindings = this.ffiRsDefine(this.functions) as LabrecorderBindings
    }

    public createRecording(filename: string, watchFor: string[]) {
        this.filename = filename
        this.watchFor = watchFor

        return this.callRecordingCreate()
    }

    private callRecordingCreate() {
        return this.bindings.recording_create([this.filename, this.watchFor])
    }

    public stopRecording(recording: BoundRecording) {
        this.recording = recording
        this.callRecordingStop()
    }

    private callRecordingStop() {
        this.bindings.recording_stop([this.recording])
    }

    public deleteRecording(recording: BoundRecording) {
        this.stopRecording(recording)
        this.callRecordingDelete()
    }

    private callRecordingDelete() {
        this.bindings.recording_delete([this.recording])
    }

    private get libraryOptions() {
        return {
            library: 'labrecorder',
            path: this.labrecorderPath,
        }
    }

    private get functions() {
        return {
            recording_create: {
                library: 'labrecorder',
                retType: this.BoundRecordingType,
                paramsType: [this.FilenameType, this.WatchForType],
            },
            recording_stop: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [this.BoundRecordingType],
            },
            recording_delete: {
                library: 'labrecorder',
                retType: DataType.Void,
                paramsType: [this.BoundRecordingType],
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
    private readonly BoundRecordingType = DataType.External
}

export interface Labrecorder {
    createRecording(filename: string, watchFor: string[]): BoundRecording
    stopRecording(recording: BoundRecording): void
    deleteRecording(recording: BoundRecording): void
}

export type LabrecorderConstructor = new (
    labrecorderPath: string
) => Labrecorder

export interface LabrecorderBindings {
    recording_create(args: [string, string[]]): BoundRecording
    recording_stop(args: [BoundRecording]): void
    recording_delete(args: [BoundRecording]): void
}

export type BoundRecording = DataType.External
