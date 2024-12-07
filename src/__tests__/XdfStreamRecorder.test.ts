import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import XdfStreamRecorder, {
    StreamRecorder,
} from '../components/XdfStreamRecorder'

export default class XdfStreamRecorderTest extends AbstractSpruceTest {
    private static instance: StreamRecorder

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.XdfStreamRecorder()
    }

    @test()
    protected static async canCreateXdfStreamRecorder() {
        assert.isTruthy(this.instance)
    }

    private static XdfStreamRecorder() {
        return XdfStreamRecorder.Create()
    }
}
