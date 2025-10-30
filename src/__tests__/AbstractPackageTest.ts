import {
    FakeStreamOutlet,
    FakeStreamInfo,
    LslStreamInfo,
    LslStreamOutlet,
} from '@neurodevs/node-lsl'
import AbstractModuleTest from '@neurodevs/node-tdd'

export default class AbstractPackageTest extends AbstractModuleTest {
    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeStreamOutlet()
        this.setFakeStreamInfo()
    }

    protected static setFakeStreamInfo() {
        LslStreamInfo.Class = FakeStreamInfo
        FakeStreamInfo.resetTestDouble()
    }

    protected static setFakeStreamOutlet() {
        LslStreamOutlet.Class = FakeStreamOutlet
        FakeStreamOutlet.resetTestDouble()
    }
}
