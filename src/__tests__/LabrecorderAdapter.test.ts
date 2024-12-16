import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import { DataType, OpenParams } from 'ffi-rs'
import LabrecorderAdapter, {
    Labrecorder,
    LabrecorderBindings,
} from '../components/LabrecorderAdapter'

export default class LabrecorderAdapterTest extends AbstractSpruceTest {
    private static instance: Labrecorder
    private static fakeBindings: LabrecorderBindings
    private static ffiRsOpenOptions?: OpenParams
    private static ffiRsDefineOptions?: Record<string, any>
    private static recordingCreateCalls: any[] = []

    private static readonly filename = generateId()
    private static readonly watchFor = [generateId(), generateId()]

    protected static async beforeEach() {
        await super.beforeEach()

        this.setupFakeBindings()
        this.fakeFfiRsOpen()
        this.fakeFfiRsDefine()

        this.instance = await this.LabrecorderAdapter()
    }

    @test()
    protected static async canCreateLabrecorderAdapter() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = await assert.doesThrowAsync(
            // @ts-ignore
            async () => await LabrecorderAdapter.Create()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['labrecorderPath'],
        })
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
        await this.LabrecorderAdapter()

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
        this.instance.createRecording(this.filename, this.watchFor)

        assert.isEqualDeep(
            this.recordingCreateCalls[0],
            {
                filename: this.filename,
                watchFor: this.watchFor,
            },
            'Should create a recording!'
        )
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
        return {
            recording_create: ([filename, watchFor]: any[]) => {
                this.recordingCreateCalls.push({
                    filename,
                    watchFor,
                })
                return {} as any
            },
            recording_stop: () => {},
            recording_delete: () => {},
        }
    }

    private static async LabrecorderAdapter(labrecorderPath?: string) {
        return await LabrecorderAdapter.Create(
            labrecorderPath ?? this.labrecorderPath
        )
    }
}
