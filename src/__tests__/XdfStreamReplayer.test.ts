import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import XdfFileLoader from '../components/XdfFileLoader'
import XdfStreamReplayer, { XdfReplayer } from '../components/XdfStreamReplayer'
import FakeXdfLoader from '../testDoubles/XdfLoader/FakeXdfLoader'

export default class XdfStreamReplayerTest extends AbstractSpruceTest {
    private static instance: XdfReplayer

    protected static async beforeEach() {
        await super.beforeEach()

        XdfFileLoader.Class = FakeXdfLoader
        FakeXdfLoader.resetTestDouble()

        this.instance = await this.XdfStreamReplayer()
    }

    @test()
    protected static async canCreateXdfStreamReplayer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = await assert.doesThrowAsync(async () => {
            // @ts-ignore
            await XdfStreamReplayer.Create()
        })
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['filePath'],
        })
    }

    @test()
    protected static async createsXdfFileLoader() {
        assert.isEqual(
            FakeXdfLoader.numConstructorCalls,
            1,
            'Should create an XdfFileLoader!'
        )
    }

    private static readonly filePath = generateId()

    private static async XdfStreamReplayer(filePath = this.filePath) {
        return XdfStreamReplayer.Create(filePath)
    }
}
