import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import { DataType, OpenParams } from 'ffi-rs'
import LabrecorderAdapter, {
    Labrecorder,
} from '../components/LabrecorderAdapter'

export default class LabrecorderAdapterTest extends AbstractSpruceTest {
    private static instance: Labrecorder
    private static ffiRsOpenOptions?: OpenParams
    private static ffiRsDefineOptions?: Record<string, any>

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeFfiRsOpen()
        this.fakeFfiRsDefine()

        this.instance = this.LabrecorderAdapter()
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
                        DataType.String, //   filename
                        DataType.External, // streams
                        DataType.External, // watchfor
                        DataType.External, // syncOptions
                        DataType.Boolean, //  collect_offsets
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

    private static fakeFfiRsOpen() {
        LabrecorderAdapter.ffiRsOpen = (options) => {
            this.ffiRsOpenOptions = options
        }
    }

    private static fakeFfiRsDefine() {
        LabrecorderAdapter.ffiRsDefine = (options) => {
            this.ffiRsDefineOptions = options
            return {} as any
        }
    }

    private static readonly labrecorderPath = generateId()

    private static LabrecorderAdapter(labrecorderPath?: string) {
        return LabrecorderAdapter.Create(
            labrecorderPath ?? this.labrecorderPath
        )
    }
}
