import { assertOptions } from '@sprucelabs/schema'
import ffi from 'ffi-napi'
import SpruceError from './errors/SpruceError'

export default class LibxdfImpl implements Libxdf {
	protected bindings: LibxdfBindings

	private static instance?: Libxdf
	private static ffi = ffi
	private libxdfPath: string

	public static getInstance() {
		if (!this.instance) {
			this.setInstance(this.Libxdf())
		}
		return this.instance!
	}

	public static setInstance(instance: Libxdf) {
		this.instance = instance
	}

	public static clearInstance() {
		this.instance = undefined
	}

	public static setFfi(ffi: any) {
		this.ffi = ffi
	}

	public static getFfi() {
		return this.ffi
	}

	public static Libxdf() {
		const { LIBXDF_PATH } = assertOptions(
			process.env,
			['LIBXDF_PATH'],
			'Please set env.LIBXDF_PATH!'
		)
		const instance = new this(LIBXDF_PATH)
		this.setInstance(instance)
		return instance
	}

	protected constructor(libxdfPath: string) {
		this.libxdfPath = libxdfPath

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
		return LibxdfImpl.ffi.Library(this.libxdfPath, {
			load_xdf: ['int', ['string']],
		}) as LibxdfBindings
	}
}

export interface Libxdf {}

export interface LibxdfBindings {
	load_xdf(path: string): number
}
