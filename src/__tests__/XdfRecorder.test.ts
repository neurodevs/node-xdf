import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import XdfRecorder, { XdfFileRecorder } from '../components/XdfRecorder'

export default class XdfRecorderTest extends AbstractSpruceTest {
    private static instance: XdfFileRecorder

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.XdfRecorder()
    }

    @test()
    protected static async canCreateXdfRecorder() {
        assert.isTruthy(this.instance)
    }

    private static XdfRecorder() {
        return XdfRecorder.Create()
    }
}
