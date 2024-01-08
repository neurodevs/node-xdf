import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidTimeoutMsSchema: SpruceErrors.NodeXdf.InvalidTimeoutMsSchema  = {
	id: 'invalidTimeoutMs',
	namespace: 'NodeXdf',
	name: 'Invalid Timeout Ms',
	    fields: {
	            /** . */
	            'timeoutMs': {
	                type: 'number',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidTimeoutMsSchema)

export default invalidTimeoutMsSchema
