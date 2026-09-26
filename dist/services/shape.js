export const FLIGHT_SUMMARY_FIELDS = [
    'FlightNo', 'FlightCompany', 'ftype', 'ShareFlag', 'ShareFlightNo', 'StopFlag',
    'FlightDepcode', 'FlightArrcode', 'FlightDepAirport', 'FlightArrAirport',
    'FlightHTerminal', 'FlightTerminal', 'BoardGate',
    'FlightDeptimePlanDate', 'FlightArrtimePlanDate',
    'FlightDeptimeReadyDate', 'FlightArrtimeReadyDate',
    'FlightDeptimeDate', 'FlightArrtimeDate',
    'FlightState', 'OntimeRate',
];
export const TRANSFER_SUMMARY_FIELDS = [
    'FlightNo', 'DepTime', 'ArrTime',
    'DepCityZh', 'DepAirportZh', 'DepAirportCode', 'DepTerminal',
    'ArrCityZh', 'ArrAirportZh', 'ArrAirportCode', 'ArrTerminal',
];
const isEmpty = (v) => v === null || v === undefined || v === '' ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);
function pickFields(item, fields) {
    if (Array.isArray(item))
        return item.map(leg => pickFields(leg, fields));
    if (!item || typeof item !== 'object')
        return item;
    const picked = {};
    for (const k of fields) {
        if (!isEmpty(item[k]))
            picked[k] = item[k];
    }
    return picked;
}
// 三个参数都不传时原样返回,保证老调用方拿到的输出不变
export function shapeListResult(result, args, summaryFields) {
    const detail = args.detail ?? 'full';
    const limit = args.limit && args.limit > 0 ? args.limit : undefined;
    const offset = Math.max(args.offset ?? 0, 0);
    if (detail !== 'summary' && limit === undefined && offset === 0)
        return result;
    if (!result || typeof result !== 'object' || !Array.isArray(result.data))
        return result;
    const items = result.data;
    let page = limit === undefined ? items.slice(offset) : items.slice(offset, offset + limit);
    if (detail === 'summary')
        page = page.map(item => pickFields(item, summaryFields));
    const shaped = { ...result, data: page, total: items.length, offset, returned: page.length };
    if (offset + page.length < items.length)
        shaped.next_offset = offset + page.length;
    return shaped;
}
