import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import XdfStreamReplayer, { XdfReplayer } from '../components/XdfStreamReplayer'

export default class XdfStreamReplayerTest extends AbstractSpruceTest {
    private static instance: XdfReplayer

    protected static async beforeEach() {
        await super.beforeEach()
        this.instance = this.XdfStreamReplayer()
    }

    @test()
    protected static async canCreateXdfStreamReplayer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = assert.doesThrow(() => {
            // @ts-ignore
            XdfStreamReplayer.Create()
        })
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['filePath'],
        })
    }

    private static readonly filePath = generateId()

    private static XdfStreamReplayer(filePath = this.filePath) {
        return XdfStreamReplayer.Create(filePath)
    }
}
