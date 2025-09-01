import AbstractSpruceTest from '@sprucelabs/test-utils'
import {
    FakeLslOutlet,
    FakeStreamInfo,
    LslStreamInfo,
    LslStreamOutlet,
} from '@neurodevs/node-lsl'

export default class AbstractPackageTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeLslOutlet()
        this.setFakeStreamInfo()
    }

    protected static setFakeStreamInfo() {
        LslStreamInfo.Class = FakeStreamInfo
        FakeStreamInfo.resetTestDouble()
    }

    protected static setFakeLslOutlet() {
        LslStreamOutlet.Class = FakeLslOutlet
        FakeLslOutlet.resetTestDouble()
    }
}
