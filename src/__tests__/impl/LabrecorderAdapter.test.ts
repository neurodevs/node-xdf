import generateId from '@neurodevs/generate-id'
import { test, assert } from '@neurodevs/node-tdd'
import { DataType, OpenParams } from 'ffi-rs'

import LabrecorderAdapter, {
    BoundRecording,
    Labrecorder,
    LabrecorderBindings,
} from '../../impl/LabrecorderAdapter.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class LabrecorderAdapterTest extends AbstractPackageTest {
    private static instance: Labrecorder
    private static fakeBindings: LabrecorderBindings
    private static ffiRsOpenOptions?: OpenParams
    private static ffiRsDefineOptions?: Record<string, unknown>

    private static callsToRecordingCreate: {
        filename: string
        watchFor: string[]
    }[] = []

    private static callsToRecordingStop: BoundRecording[] = []
    private static callsToRecordingDelete: BoundRecording[] = []

    private static readonly filename = generateId()
    private static readonly watchFor = [generateId(), generateId()]

    protected static async beforeEach() {
        await super.beforeEach()

        this.setupFakeBindings()
        this.fakeFfiRsOpen()
        this.fakeFfiRsDefine()

        this.instance = this.LabrecorderAdapter()
    }

    @test()
    protected static async canCreateLabrecorderAdapter() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async callsFfiRsOpenWithRequiredOptions() {
        assert.isEqualDeep(this.ffiRsOpenOptions, {
            library: 'labrecorder',
            path: this.labrecorderPath,
        })
    }

    @test()
    protected static async callsFfiRsDefineWithRequiredOptions() {
        this.LabrecorderAdapter()

        assert.isEqualDeep(
            this.ffiRsDefineOptions,
            {
                recording_create: {
                    library: 'labrecorder',
                    retType: DataType.External, // Pointer to the recording object
                    paramsType: [
                        DataType.String, // filename
                        DataType.StringArray, // watchfor
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
                    paramsType: [
                        DataType.External, // Pointer to the recording object
                    ],
                },
            },
            'Please pass valid options to ffiRsDefine!'
        )
    }

    @test()
    protected static async createRecordingCallsBindings() {
        this.createRecording()

        assert.isEqualDeep(
            this.callsToRecordingCreate[0],
            {
                filename: this.filename,
                watchFor: this.watchFor,
            },
            'Should create a recording!'
        )
    }

    @test()
    protected static async defaultsToMacOsPath() {
        const defaultLabrecorderPath = '/opt/local/lib/liblabrecorder.dylib'
        LabrecorderAdapter.Create()

        const { path } = this.ffiRsOpenOptions ?? {}

        assert.isEqual(path, defaultLabrecorderPath)
    }

    @test()
    protected static async stopRecordingCallsBindings() {
        const recording = this.createRecording()
        this.stopRecording(recording)

        assert.isEqualDeep(this.callsToRecordingStop[0], { recording })
    }

    @test()
    protected static async deleteRecordingCallsBindings() {
        const recording = this.createAndDeleteRecording()

        assert.isEqualDeep(this.callsToRecordingDelete[0], { recording })
    }

    @test()
    protected static async callingDeleteFirstCallsStop() {
        const recording = this.createAndDeleteRecording()

        assert.isEqualDeep(this.callsToRecordingStop[0], { recording })
    }

    private static createAndDeleteRecording() {
        const recording = this.createRecording()
        this.deleteRecording(recording)
        return recording
    }

    private static createRecording() {
        return this.instance.createRecording(this.filename, this.watchFor)
    }

    private static stopRecording(recording: BoundRecording) {
        this.instance.stopRecording(recording)
    }

    private static deleteRecording(recording: BoundRecording) {
        this.instance.deleteRecording(recording)
    }

    private static setupFakeBindings() {
        this.fakeBindings = this.FakeBindings()
    }

    private static fakeFfiRsOpen() {
        LabrecorderAdapter.ffiRsOpen = (options) => {
            this.ffiRsOpenOptions = options
        }
    }

    private static fakeFfiRsDefine() {
        LabrecorderAdapter.ffiRsDefine = (options) => {
            this.ffiRsDefineOptions = options
            return this.fakeBindings as any
        }
    }

    private static readonly labrecorderPath = generateId()

    private static FakeBindings() {
        this.callsToRecordingCreate = []
        this.callsToRecordingStop = []
        this.callsToRecordingDelete = []

        return {
            recording_create: ([filename, watchFor]: [string, string[]]) => {
                this.callsToRecordingCreate.push({
                    filename,
                    watchFor,
                })
                return {} as BoundRecording
            },
            recording_stop: ([recording]: [BoundRecording]) => {
                this.callsToRecordingStop.push(recording)
            },
            recording_delete: ([recording]: [BoundRecording]) => {
                this.callsToRecordingDelete.push(recording)
            },
        }
    }

    private static LabrecorderAdapter(labrecorderPath?: string) {
        return LabrecorderAdapter.Create(
            labrecorderPath ?? this.labrecorderPath
        )
    }
}
