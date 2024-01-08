import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface InvalidTimeoutMsErrorOptions extends SpruceErrors.NodeXdf.InvalidTimeoutMs, ISpruceErrorOptions {
	code: 'INVALID_TIMEOUT_MS'
}
export interface FailedToLoadLibxdfErrorOptions extends SpruceErrors.NodeXdf.FailedToLoadLibxdf, ISpruceErrorOptions {
	code: 'FAILED_TO_LOAD_LIBXDF'
}

type ErrorOptions =  | InvalidTimeoutMsErrorOptions  | FailedToLoadLibxdfErrorOptions 

export default ErrorOptions
