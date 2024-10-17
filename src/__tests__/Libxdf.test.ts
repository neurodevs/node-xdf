import AbstractSpruceTest, {
	test,
	assert,
	errorAssert,
	generateId,
} from '@sprucelabs/test-utils'
import {
	MangledNameExtractorImpl,
	FakeMangledNameExtractor,
} from '@neurodevs/node-mangled-names'
import { DataType, OpenParams } from 'ffi-rs'
import LibxdfImpl, {
	FfiRsDefineOptions,
	LibxdfBindings,
	XdfFile,
} from '../Libxdf'
import SpyLibxdf from '../testDoubles/SpyLibxdf'

export default class LibxdfTest extends AbstractSpruceTest {
	private static instance: SpyLibxdf
	private static libxdfPath: string
	private static path: string
	private static shouldThrowWhenLoadingBindings: boolean
	private static mangledLoadXdfName: string
	private static fakeBindings: LibxdfBindings
	private static ffiRsOpenOptions?: OpenParams
	private static ffiRsDefineOptions?: FfiRsDefineOptions
	private static loadXdfCalls: string[][] = []

	protected static async beforeEach() {
		await super.beforeEach()

		LibxdfImpl.Class = SpyLibxdf
		MangledNameExtractorImpl.Class = FakeMangledNameExtractor

		FakeMangledNameExtractor.clearTestDouble()

		this.libxdfPath = generateId()
		this.path = generateId()
		this.shouldThrowWhenLoadingBindings = false
		this.mangledLoadXdfName = this.generateMangledName()
		this.fakeBindings = this.FakeBindings()

		this.setFakeExtractResult()
		this.clearAndFakeFfi()

		this.instance = await this.Libxdf()
	}

	@test()
	protected static canCreateInstance() {
		assert.isTruthy(this.instance, 'Should create an instance!')
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		const err = await assert.doesThrowAsync(
			// @ts-ignore
			async () => await LibxdfImpl.Create()
		)

		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['libxdfPath'],
		})
	}

	@test()
	protected static async throwsWhenBindingsFailToLoad() {
		this.shouldThrowWhenLoadingBindings = true
		const err = await assert.doesThrowAsync(async () => await this.Libxdf())

		errorAssert.assertError(err, 'FAILED_TO_LOAD_LIBXDF', {
			libxdfPath: this.libxdfPath,
		})
	}

	@test()
	protected static async callsFfiRsOpenWithRequiredOptions() {
		assert.isEqualDeep(this.ffiRsOpenOptions, {
			library: 'xdf',
			path: this.libxdfPath,
		})
	}

	@test()
	protected static async callsFfiRsDefineWithRequiredOptions() {
		const mangledLoadXdfName = generateId()
		this.setFakeExtractResult(mangledLoadXdfName)

		await this.Libxdf()

		assert.isEqualDeep(
			this.ffiRsDefineOptions,
			{
				[mangledLoadXdfName.slice(1)]: {
					library: 'xdf',
					retType: DataType.String,
					paramsType: [DataType.String],
				},
			},
			'Please pass valid options to ffiRsDefine!'
		)
	}

	@test()
	protected static async loadXdfCallsBindings() {
		this.instance.loadXdf(this.path)

		assert.isEqualDeep(
			this.loadXdfCalls[0],
			[this.path],
			'Should have called load_xdf_to_json(path)!'
		)
	}

	@test()
	protected static async createsMangledNameExtractor() {
		assert.isEqual(FakeMangledNameExtractor.numConstructorCalls, 1)
	}

	@test()
	protected static async callsExtractorWithCorrectParams() {
		assert.isEqualDeep(FakeMangledNameExtractor.extractCalls[0], {
			libPath: this.libxdfPath,
			unmangledNames: [this.loadXdfName],
		})
	}

	private static setFakeExtractResult(
		mangledLoadXdfName = this.mangledLoadXdfName
	) {
		FakeMangledNameExtractor.fakeResult = {
			load_xdf_to_json: mangledLoadXdfName,
		}
	}

	private static generateMangledName() {
		return `${generateId()}${this.loadXdfName}${generateId()}`
	}

	private static clearAndFakeFfi() {
		delete this.ffiRsOpenOptions
		delete this.ffiRsDefineOptions
		this.fakeFfiRsOpen()
		this.fakeFfiRsDefine()
	}

	private static fakeFfiRsOpen() {
		LibxdfImpl.ffiRsOpen = (options) => {
			this.ffiRsOpenOptions = options
		}
	}

	private static fakeFfiRsDefine() {
		LibxdfImpl.ffiRsDefine = (options) => {
			this.ffiRsDefineOptions = options

			if (this.shouldThrowWhenLoadingBindings) {
				throw new Error('Fake fail to create bindings!')
			}

			return this.fakeBindings as any
		}
	}

	private static readonly loadXdfName = 'load_xdf_to_json'

	private static FakeBindings(mangledLoadXdfName = this.mangledLoadXdfName) {
		return {
			[mangledLoadXdfName.slice(1)]: (path: string[]) => {
				this.loadXdfCalls.push(path)
				return {} as XdfFile
			},
		}
	}

	private static async Libxdf(libxdfPath?: string) {
		return (await LibxdfImpl.Create(libxdfPath ?? this.libxdfPath)) as SpyLibxdf
	}
}
