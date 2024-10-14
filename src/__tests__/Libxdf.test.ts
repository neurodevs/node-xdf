import AbstractSpruceTest, {
	test,
	assert,
	errorAssert,
	generateId,
} from '@sprucelabs/test-utils'
import { DataType, OpenParams } from 'ffi-rs'
import LibxdfImpl, {
	FfiRsDefineOptions,
	LibxdfBindings,
	XdfFile,
} from '../Libxdf'
import SpyLibxdf from '../testDoubles/SpyLibxdf'

export default class LibxdfTest extends AbstractSpruceTest {
	private static libxdf: SpyLibxdf
	private static libxdfPath: string
	private static shouldThrowWhenLoadingBindings: boolean
	private static fakeBindings: LibxdfBindings
	private static ffiRsOpenOptions?: OpenParams
	private static ffiRsDefineOptions?: FfiRsDefineOptions

	protected static async beforeEach() {
		await super.beforeEach()

		LibxdfImpl.Class = SpyLibxdf

		this.libxdfPath = generateId()
		this.shouldThrowWhenLoadingBindings = false
		this.fakeBindings = this.FakeBindings()

		this.clearAndFakeFfi()

		this.libxdf = this.Libxdf()
	}

	@test()
	protected static canCreateInstance() {
		assert.isTruthy(this.libxdf, 'Should create an instance!')
	}

	@test()
	protected static async throwsWithMissingRequiredOptions() {
		// @ts-ignore
		const err = assert.doesThrow(() => LibxdfImpl.Create())

		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['libxdfPath'],
		})
	}

	@test()
	protected static async throwsWhenBindingsFailToLoad() {
		this.shouldThrowWhenLoadingBindings = true
		const err = assert.doesThrow(() => this.Libxdf())

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
		assert.isEqualDeep(
			this.ffiRsDefineOptions,
			{
				load_xdf: {
					library: 'xdf',
					retType: DataType.External,
					paramsType: [DataType.String],
				},
			},
			'Please pass valid options to ffiRsDefine!'
		)
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

	private static FakeBindings() {
		return {
			load_xdf: (_libxdfPath: string) => {
				return {} as XdfFile
			},
		}
	}

	private static Libxdf(libxdfPath?: string) {
		return LibxdfImpl.Create(libxdfPath ?? this.libxdfPath) as SpyLibxdf
	}
}
