import {
    FakeLslOutlet,
    FakeLslInfo,
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
        LslStreamInfo.Class = FakeLslInfo
        FakeLslInfo.resetTestDouble()
    }

    protected static setFakeStreamOutlet() {
        LslStreamOutlet.Class = FakeLslOutlet
        FakeLslOutlet.resetTestDouble()
    }
}
