/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.NodeXdf {

	
	export interface InvalidTimeoutMs {
		
			
			'timeoutMs': number
	}

	export interface InvalidTimeoutMsSchema extends SpruceSchema.Schema {
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

	export type InvalidTimeoutMsEntity = SchemaEntity<SpruceErrors.NodeXdf.InvalidTimeoutMsSchema>

}



export declare namespace SpruceErrors.NodeXdf {

	
	export interface FailedToLoadLibxdf {
		
			
			'libxdfPath': string
	}

	export interface FailedToLoadLibxdfSchema extends SpruceSchema.Schema {
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

	export type FailedToLoadLibxdfEntity = SchemaEntity<SpruceErrors.NodeXdf.FailedToLoadLibxdfSchema>

}




