import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import LabrecorderAdapter from '../components/LabrecorderAdapter'
import XdfStreamRecorder, { XdfRecorder } from '../components/XdfStreamRecorder'
import FakeLabrecorder from '../testDoubles/Labrecorder/FakeLabrecorder'

export default class XdfStreamRecorderTest extends AbstractSpruceTest {
    private static instance: XdfRecorder

    protected static async beforeEach() {
        await super.beforeEach()

        LabrecorderAdapter.Class = FakeLabrecorder
        FakeLabrecorder.resetTestDouble()

        this.instance = this.XdfStreamRecorder()
    }

    @test()
    protected static async canCreateXdfStreamRecorder() {
        assert.isTruthy(this.instance, 'Should have created an instance!')
    }

    @test()
    protected static async createsLabrecorderAdapterInstance() {
        assert.isEqual(
            FakeLabrecorder.constructorCalls.length,
            1,
            'Should have created an instance of LabrecorderAdapter!'
        )
    }

    private static XdfStreamRecorder() {
        return XdfStreamRecorder.Create()
    }
}
