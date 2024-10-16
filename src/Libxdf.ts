import { assertOptions } from '@sprucelabs/schema'
import { MangledNameExtractorImpl } from '@neurodevs/node-mangled-names'
import { DataType, define, FieldType, FuncObj, open } from 'ffi-rs'
import SpruceError from './errors/SpruceError'

export default class LibxdfImpl implements Libxdf {
	public static Class?: LibxdfConstructor
	public static ffiRsOpen = open
	public static ffiRsDefine = define

	protected bindings!: LibxdfBindings
	private libxdfPath: string

	protected constructor(libxdfPath: string) {
		this.libxdfPath = libxdfPath
		this.tryToLoadBindings()
	}

	public static async Create(libxdfPath: string) {
		assertOptions({ libxdfPath }, ['libxdfPath'])
		const extractor = MangledNameExtractorImpl.Create()
		extractor.extract(libxdfPath, ['load_xdf'])
		return new (this.Class ?? this)(libxdfPath)
	}

	private tryToLoadBindings() {
		try {
			this.bindings = this.loadBindings()
		} catch (err: any) {
			throw new SpruceError({
				code: 'FAILED_TO_LOAD_LIBXDF',
				libxdfPath: this.libxdfPath,
				originalError: err,
			})
		}
	}

	private loadBindings() {
		this.openLibxdf()
		return this.defineBindings()
	}

	private openLibxdf() {
		LibxdfImpl.ffiRsOpen({
			library: 'libxdf',
			path: this.libxdfPath,
		})
	}

	private defineBindings() {
		return LibxdfImpl.ffiRsDefine({
			load_xdf: {
				library: 'libxdf',
				retType: DataType.I32,
				paramsType: [DataType.String],
			},
		})
	}

	public loadXdf(path: string) {
		return this.bindings.load_xdf([path])
	}
}

export interface Libxdf {
	loadXdf(path: string): XdfFile
}

export type LibxdfConstructor = new (libxdfPath: string) => Libxdf

export interface LibxdfBindings {
	load_xdf(path: string[]): LibxdfStatusCode
}

export type LibxdfStatusCode = 0 | Exclude<number, 0>

export type FfiRsDefineOptions = FuncObj<FieldType, boolean | undefined>

export type XdfFile = any
