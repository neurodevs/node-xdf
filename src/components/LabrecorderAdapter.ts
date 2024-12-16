import { assertOptions } from '@sprucelabs/schema'
import { DataType, define, JsExternal, open } from 'ffi-rs'
import { LibxdfStreamInfo } from './LibxdfAdapter'

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

    public createRecording(
        filename: string,
        streams: LibxdfStreamInfo[],
        watchFor: string[],
        syncOptions: Map<string, string>,
        collectOffsets: boolean
    ) {
        return this.bindings.recording_create(
            filename as unknown as DataType.String,
            streams as unknown as DataType.External,
            watchFor as unknown as DataType.External,
            syncOptions as unknown as DataType.External,
            collectOffsets as unknown as DataType.Boolean
        ) as unknown as JsExternal
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
                    DataType.String, //    filename
                    DataType.External, //  streams
                    DataType.External, //  watchfor
                    DataType.External, //  syncOptions
                    DataType.Boolean, //   collect_offsets
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
                paramsType: [DataType.External],
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
    createRecording(
        filename: string,
        streams: LibxdfStreamInfo[],
        watchFor: string[],
        syncOptions: Map<string, string>,
        collectOffsets: boolean
    ): JsExternal
}

export type LabrecorderAdapterConstructor = new () => Labrecorder

export interface LabrecorderBindings {
    recording_create: RecordingCreateFunction
    recording_stop: RecordingStopFunction
    recording_delete: RecordingDeleteFunction
}

export type RecordingCreateFunction = (
    filename: DataType.String,
    streams: DataType.External,
    watchfor: DataType.External,
    syncOptions: DataType.External,
    collectOffsets: DataType.Boolean
) => any

export type RecordingStopFunction = (recording: BoundRecording) => void

export type RecordingDeleteFunction = (recording: BoundRecording) => void

export type BoundRecording = JsExternal
