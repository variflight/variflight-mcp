# Variflight MCP Server

A Model Context Protocol (MCP) server implementation for VariFlight flight information services. This server provides various tools to query flight information, weather data, and flight comfort metrics.

# Variflight API Key

To use the Variflight MCP server, you need to have a Variflight API key. You can get it from [here](https://mcp.variflight.com).

## Installation

```json
{
    "mcpServers": {
        "variflight": {
            "command": "npx",
            "args": [
                "-y",
                "@variflight-ai/variflight-mcp"
            ],
            "env": {
                "VARIFLIGHT_API_KEY": "your_api_key_here"
            }
        }
    }
}
```

## Available Tools

### 1. Search Flights by Departure and Arrival
Search direct flights by city or airport code on a specific date. Use city codes like `BJS` or exact airport codes like `PEK`, but do not mix city and airport codes for the same side:
```typescript
searchFlightsByDepArr({
  dep: "PEK",  // Beijing
  arr: "SHA",  // Shanghai
  date: "2024-03-20"
})
```

### 2. Search Flights by Number
Search a specific flight by flight number and date:
```typescript
searchFlightsByNumber({
  fnum: "MU2157",
  date: "2024-03-20"
})
```

### 3. Get Flight Transfer Information
Search connecting flight options between departure and arrival cities:
```typescript
getFlightTransferInfo({
  depcity: "BJS",
  arrcity: "LAX",
  depdate: "2024-03-20"
})
```

### 4. Flight Happiness Index
Get comfort-focused details for a known flight, such as punctuality, aircraft type, cabin configuration, meals, and entertainment:
```typescript
flightHappinessIndex({
  fnum: "MU2157",
  date: "2024-03-20"
})
```

### 5. Real-time Aircraft Location
Track realtime flight location using the aircraft registration number, also called tail number:
```typescript
getRealtimeLocationByAnum({
  anum: "B2021"
})
```

### 6. Airport Weather Forecast
Get the 3-day airport weather forecast:
```typescript
getFutureWeatherByAirport({
  airport: "PEK"
})
```

### 7. Search Flight Itineraries
Get a natural-language summary with recommended flight options, overall lowest price, shortest duration, and several suggested itineraries:
```typescript
searchFlightItineraries({
  depCityCode: "BJS",  // Beijing
  arrCityCode: "SHA",  // Shanghai
  depDate: "2025-04-20"
})
```

### 8. Get Flight Prices by Cities
Get structured raw sale-flight data between two cities, with each flight returning cabin-level prices:
```typescript
getFlightPriceByCities({
  dep_city: "BJS",  // Beijing
  arr_city: "SHA",  // Shanghai
  dep_date: "2026-04-20"
})
```

## License

ISC License - See [LICENSE](LICENSE) for details.

## Author

Variflight (https://mcp.variflight.com)

## Version

Current version: 1.0.3
