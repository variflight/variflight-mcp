export declare class OpenAlService {
    private makeRequest;
    getFlightsByDepArr(dep: string, arr: string, date: string): Promise<any>;
    getFlightByNumber(fnum: string, date: string, dep?: string, arr?: string): Promise<any>;
    getFlightTransferInfo(depcity: string, arrcity: string, depdate: string): Promise<any>;
    getRealtimeLocationByAnum(anum: string): Promise<any>;
    getAirportWeather(airport: string): Promise<any>;
    getFlightHappinessIndex(fnum: string, date: string, dep?: string, arr?: string): Promise<any>;
}
