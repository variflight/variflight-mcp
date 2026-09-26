export declare const FLIGHT_SUMMARY_FIELDS: string[];
export declare const TRANSFER_SUMMARY_FIELDS: string[];
export interface PagingArgs {
    limit?: number;
    offset?: number;
    detail?: 'full' | 'summary';
}
export declare function shapeListResult(result: any, args: PagingArgs, summaryFields: string[]): any;
