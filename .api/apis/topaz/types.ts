import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type GetCreditBalanceResponse200 = FromSchema<typeof schemas.GetCreditBalance.response['200']>;
