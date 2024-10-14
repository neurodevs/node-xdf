import { assertOptions } from '@sprucelabs/schema'
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

	public static Create(libxdfPath: string) {
		assertOptions({ libxdfPath }, ['libxdfPath'])
		return new (this.Class ?? this)(libxdfPath)
	}

	private tryToLoadBindings() {
		try {
			this.bindings = this.loadBindings()
		} catch {
			throw new SpruceError({
				code: 'FAILED_TO_LOAD_LIBXDF',
				libxdfPath: this.libxdfPath,
			})
		}
	}

	private loadBindings() {
		this.openLibxdf()
		return this.defineBindings()
	}

	private openLibxdf() {
		LibxdfImpl.ffiRsOpen({
			library: 'xdf',
			path: this.libxdfPath,
		})
	}

	private defineBindings() {
		return LibxdfImpl.ffiRsDefine({
			load_xdf: {
				library: 'xdf',
				retType: DataType.External,
				paramsType: [DataType.String],
			},
		})
	}
}

export interface Libxdf {}

export type LibxdfConstructor = new (libxdfPath: string) => Libxdf

export interface LibxdfBindings {
	load_xdf(path: string): XdfFile
}

export type FfiRsDefineOptions = FuncObj<FieldType, boolean | undefined>

export type XdfFile = any
