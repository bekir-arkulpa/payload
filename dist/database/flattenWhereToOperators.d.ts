import { Where, WhereField } from '../types';
declare const flattenWhereToOperators: (query: Where) => WhereField[];
export default flattenWhereToOperators;
