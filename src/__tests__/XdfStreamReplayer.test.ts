import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
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

    private static XdfStreamReplayer() {
        return XdfStreamReplayer.Create()
    }
}
