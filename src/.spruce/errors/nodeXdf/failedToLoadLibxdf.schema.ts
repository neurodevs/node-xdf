import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const failedToLoadLibxdfSchema: SpruceErrors.NodeXdf.FailedToLoadLibxdfSchema  = {
	id: 'failedToLoadLibxdf',
	namespace: 'NodeXdf',
	name: 'Failed to Load Libxdf',
	    fields: {
	            /** . */
	            'libxdfPath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(failedToLoadLibxdfSchema)

export default failedToLoadLibxdfSchema
