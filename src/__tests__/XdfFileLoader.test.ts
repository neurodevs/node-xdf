import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import {
    FakeMangledNameExtractor,
    MangledNameExtractorImpl,
} from '@neurodevs/node-mangled-names'
import LibxdfAdapter from '../components/LibxdfAdapter'
import XdfFileLoader, { XdfStream } from '../components/XdfFileLoader'
import FakeLibxdf from '../testDoubles/Libxdf/FakeLibxdf'
import SpyXdfLoader from '../testDoubles/XdfLoader/SpyXdfLoader'

export default class XdfFileLoaderTest extends AbstractSpruceTest {
    private static instance: SpyXdfLoader
    private static filePath: string

    protected static async beforeEach() {
        await super.beforeEach()

        LibxdfAdapter.Class = FakeLibxdf
        FakeLibxdf.resetTestDouble()

        MangledNameExtractorImpl.Class = FakeMangledNameExtractor
        FakeMangledNameExtractor.clearTestDouble()

        XdfFileLoader.Class = SpyXdfLoader

        this.filePath = generateId()
        this.instance = await this.XdfFileLoader()
    }

    @test()
    protected static async canCreateInstance() {
        assert.isTruthy(this.instance, 'Should have created an instance!')
    }

    @test()
    protected static async loadThrowsWithMissingRequiredOptions() {
        const err = await assert.doesThrowAsync(
            //@ts-ignore
            async () => await this.instance.load()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['filePath'],
        })
    }

    @test()
    protected static async loadThrowsWithInvalidTimeout() {
        await this.assertInvalidTimeout(-1)
        await this.assertInvalidTimeout(-1.5)
    }

    @test()
    protected static async createsLibxdfInstance() {
        assert.isEqual(
            FakeLibxdf.libxdfPath,
            this.defaultLibxdfPath,
            `Should create libxdf with path: ${this.defaultLibxdfPath}!\n`
        )
    }

    @test()
    protected static async callsLoadXdfWithFilePath() {
        await this.load()
        assert.isEqual(FakeLibxdf.loadXdfCalls[0], this.filePath)
    }

    @test()
    protected static async returnsXdfFile() {
        const fakeXdf = { path: '', streams: [{} as XdfStream], events: [] }
        FakeLibxdf.fakeXdfFile = fakeXdf

        const result = await this.load()

        assert.isEqual(result, fakeXdf)
    }

    private static async load(options?: TestXdfLoaderLoadOptions) {
        const { filePath = this.filePath, ...loadOptions } = options ?? {}
        return await this.instance.load(filePath, loadOptions)
    }

    private static async assertInvalidTimeout(timeoutMs: number) {
        const err = await assert.doesThrowAsync(() => this.load({ timeoutMs }))

        errorAssert.assertError(err, 'INVALID_TIMEOUT_MS', {
            timeoutMs,
        })
    }

    private static readonly defaultLibxdfPath = '/opt/local/lib/libxdf.dylib'

    private static async XdfFileLoader() {
        const instance = await XdfFileLoader.Create(this.defaultLibxdfPath)
        return instance as SpyXdfLoader
    }
}

interface TestXdfLoaderLoadOptions {
    filePath?: string
    timeoutMs?: number
    throwIfLibxdfDoesNotExist?: boolean
}
