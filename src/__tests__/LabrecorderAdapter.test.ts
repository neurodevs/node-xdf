import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
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
        assert.isTruthy(this.instance)
    }

    private static LabrecorderAdapter() {
        return LabrecorderAdapter.Create()
    }
}
