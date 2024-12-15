import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import LabrecorderAdapter, {
    Labrecorder,
} from '../components/LabrecorderAdapter'

export default class LabrecorderAdapterTest extends AbstractSpruceTest {
    private static instance: Labrecorder

    protected static async beforeEach() {
        await super.beforeEach()
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
            async () => LabrecorderAdapter.Create()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['labrecorderPath'],
        })
    }

    private static readonly labrecorderPath = generateId()

    private static LabrecorderAdapter(labrecorderPath?: string) {
        return LabrecorderAdapter.Create(
            labrecorderPath ?? this.labrecorderPath
        )
    }
}
