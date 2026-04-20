import { config } from '../config.js';

interface FlightQueryParams {
  dep?: string;
  arr?: string;
  fnum?: string;
  date: string;
  [key: string]: string | undefined;
}


export class OpenAlService {
  private async makeRequest<T>(endpoint: string, params: Record<string, string | undefined | number>): Promise<T> {
    const url = new URL(config.api.baseUrl);

    const request_body = {
      endpoint: endpoint,
      params: params
    }
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

    return response.json() as Promise<T>;
  }

  async getFlightsByDepArr(dep: string | undefined, depcity: string | undefined, arr: string | undefined, arrcity: string | undefined, date: string): Promise<any> {
    return this.makeRequest<any>('flights', {
      dep,
      depcity,
      arr,
      arrcity,
      date,
    });
  }

  async getFlightByNumber(fnum: string, date: string, dep?: string, arr?: string): Promise<any> {
    const params: FlightQueryParams = {
      fnum,
      date,
    };

    if (dep) params.dep = dep;
    if (arr) params.arr = arr;

    return this.makeRequest<any>('flight', params);
  }


  // 获取航班中转信息
  async getFlightTransferInfo(depcity: string, arrcity: string, depdate: string): Promise<any> {
    return this.makeRequest<any>('transfer', {
      depcity,
      arrcity,
      depdate
    });
  }

  async getRealtimeLocationByAnum(anum: string): Promise<any> {
    return this.makeRequest<any>('realtimeLocation', {
      anum
    });
  }


  async getAirportWeather(airport: string): Promise<any> {
    return this.makeRequest<any>('futureAirportWeather', {
      "code": airport,
      "type": "1"
    });
  }

  async getFlightHappinessIndex(fnum: string, date: string, dep?: string, arr?: string): Promise<any> {
    const params: FlightQueryParams = {
      fnum,
      date,
    };

    if (dep) params.dep = dep;
    if (arr) params.arr = arr;

    return this.makeRequest<any>('happiness', params);
  }


  async searchFlightItineraries(depCityCode: string, arrCityCode: string, depDate: string): Promise<any> {
    return this.makeRequest<any>('searchFlightItineraries', {
      "depCityCode": depCityCode,
      "arrCityCode": arrCityCode,
      "depDate": depDate
    });
  }

  async getFlightPriceByCities(dep_city: string, arr_city: string, dep_date: string): Promise<any> {
    return this.makeRequest<any>('getFlightPriceByCities', {
      dep_city,
      arr_city,
      dep_date,
      price_mode: 'lowest'
    });
  }
}
