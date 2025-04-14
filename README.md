# Variflight MCP Server

A Model Context Protocol (MCP) server implementation for Variflight flight information services. This server provides various tools to query flight information, weather data, and flight comfort metrics.

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
                "VARIFLIGHT_API_KEY": ""
            }
        }
    }
}
```

## Available Tools

### 1. Search Flights by Departure and Arrival
Search flights between airports using IATA codes:
```typescript
searchFlightsByDepArr({
  dep: "PEK",  // Beijing
  arr: "SHA",  // Shanghai
  date: "2024-03-20"
})
```

### 2. Search Flights by Number
Search flights using flight number:
```typescript
searchFlightsByNumber({
  fnum: "MU2157",
  date: "2024-03-20"
})
```

### 3. Get Flight Transfer Information
Find transfer options between cities:
```typescript
getFlightTransferInfo({
  depcity: "BJS",
  arrcity: "LAX",
  depdate: "2024-03-20"
})
```

### 4. Flight Happiness Index
Get detailed flight comfort metrics:
```typescript
flightHappinessIndex({
  fnum: "MU2157",
  date: "2024-03-20"
})
```

### 5. Real-time Aircraft Location
Track aircraft location using registration number:
```typescript
getRealtimeLocationByAnum({
  anum: "B2021"
})
```

### 6. Airport Weather Forecast
Get 3-day weather forecast for airports:
```typescript
getFutureWeatherByAirport({
  airport: "PEK"
})
```

## License

ISC License - See [LICENSE](LICENSE) for details.

## Author

Variflight (https://mcp.variflight.com)

## Version

Current version: 0.0.1

