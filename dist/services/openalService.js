import { config } from '../config.js';
export class OpenAlService {
    async makeRequest(endpoint, params) {
        const url = new URL(config.api.baseUrl);
        const request_body = {
            endpoint: endpoint,
            params: params
        };
        const response = await fetch(url.toString(), {
            method: 'post',
            headers: {
                'X-VARIFLIGHT-KEY': config.api.apiKey || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request_body),
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    async getFlightsByDepArr(dep, depcity, arr, arrcity, date) {
        return this.makeRequest('flights', {
            dep,
            depcity,
            arr,
            arrcity,
            date,
        });
    }
    async getFlightByNumber(fnum, date, dep, arr) {
        const params = {
            fnum,
            date,
        };
        if (dep)
            params.dep = dep;
        if (arr)
            params.arr = arr;
        return this.makeRequest('flight', params);
    }
    // 获取航班中转信息
    async getFlightTransferInfo(depcity, arrcity, depdate) {
        return this.makeRequest('transfer', {
            depcity,
            arrcity,
            depdate
        });
    }
    async getRealtimeLocationByAnum(anum) {
        return this.makeRequest('realtimeLocation', {
            anum
        });
    }
    async getAirportWeather(airport) {
        return this.makeRequest('futureAirportWeather', {
            "code": airport,
            "type": "1"
        });
    }
    async getFlightHappinessIndex(fnum, date, dep, arr) {
        const params = {
            fnum,
            date,
        };
        if (dep)
            params.dep = dep;
        if (arr)
            params.arr = arr;
        return this.makeRequest('happiness', params);
    }
    async searchFlightItineraries(depCityCode, arrCityCode, depDate) {
        return this.makeRequest('searchFlightItineraries', {
            "depCityCode": depCityCode,
            "arrCityCode": arrCityCode,
            "depDate": depDate
        });
    }
}
