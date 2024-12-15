import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import { OpenParams } from 'ffi-rs'
import LabrecorderAdapter, {
    Labrecorder,
} from '../components/LabrecorderAdapter'

export default class LabrecorderAdapterTest extends AbstractSpruceTest {
    private static instance: Labrecorder
    private static ffiRsOpenOptions?: OpenParams

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeFfiRsOpen()

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

    private static readonly labrecorderPath = generateId()

    private static fakeFfiRsOpen() {
        LabrecorderAdapter.ffiRsOpen = (options) => {
            this.ffiRsOpenOptions = options
        }
    }

    private static LabrecorderAdapter(labrecorderPath?: string) {
        return LabrecorderAdapter.Create(
            labrecorderPath ?? this.labrecorderPath
        )
    }
}
