#!/usr/bin/env node
import { z } from 'zod';
import { OpenAlService } from './services/openalService.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const flightService = new OpenAlService();
// 创建服务器
const server = new McpServer({
    name: "variflight-mcp",
    version: "1.0.3",
});
// 注册工具: 通过出发地和目的地查询航班
server.tool("searchFlightsByDepArr", "Search direct flights by departure and arrival location plus date. Use depcity and arrcity when the user specifies cities such as BJS or SHA. Use dep and arr when the user specifies exact airports such as PEK or PVG. Provide one departure field and one arrival field, and do not mix city and airport codes for the same side. All codes must be valid IATA 3-letter codes. Date must be in YYYY-MM-DD format. For today's date, use getTodayDate instead of hardcoding.", {
    dep: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure airport IATA 3-letter code (e.g. PEK for Beijing, CAN for Guangzhou)")
        .optional(),
    depcity: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure city IATA 3-letter code (e.g. BJS for Beijing, CAN for Guangzhou)")
        .optional(),
    arr: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival airport IATA 3-letter code (e.g. SHA for Shanghai, HFE for Hefei)")
        .optional(),
    arrcity: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival city IATA 3-letter code (e.g. SHA for Shanghai, BJS for Beijing)")
        .optional(),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If the user input contains only month and day, use getTodayDate to determine the year. For today's date, use getTodayDate instead of hardcoding.")
}, async ({ dep, depcity, arr, arrcity, date }) => {
    try {
        const flights = await flightService.getFlightsByDepArr(dep, depcity, arr, arrcity, date);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(flights, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error searching flights by dep/arr:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 注册工具: 通过航班号查询航班
server.tool("searchFlightsByNumber", "Search a flight by flight number and date. The flight number must include the airline code, for example MU2157 or CZ3969. dep and arr are optional and should only be provided when the exact airports are known. Date must be in YYYY-MM-DD format. For today's date, use getTodayDate instead of hardcoding.", {
    fnum: z.string()
        .regex(/^[A-Z0-9]{2,3}[0-9]{1,4}$/)
        .describe("Flight number including airline code (e.g. MU2157, CZ3969)"),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If the user input contains only month and day, use getTodayDate to determine the year. For today's date, use getTodayDate instead of hardcoding."),
    dep: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure airport IATA 3-letter code (e.g. HFE for Hefei)")
        .optional(),
    arr: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival airport IATA 3-letter code (e.g. CAN for Guangzhou)")
        .optional(),
}, async ({ fnum, date, dep, arr }) => {
    try {
        const flights = await flightService.getFlightByNumber(fnum, date, dep, arr);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(flights, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error searching flights by number:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 注册工具: 通过航班号查询航班
server.tool("getFlightTransferInfo", "Search connecting flight options between a departure city and an arrival city on a specific date. Use city IATA 3-letter codes such as BJS, SHA, or LAX. This tool is for transfer or connection itineraries between cities, not for airport weather, airport facilities, or realtime tracking. Date must be in YYYY-MM-DD format. For today's date, use getTodayDate instead of hardcoding.", {
    depdate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Departure date in YYYY-MM-DD format. IMPORTANT: If the user input contains only month and day, use getTodayDate to determine the year. For today's date, use getTodayDate instead of hardcoding."),
    depcity: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure city IATA 3-letter code (e.g. BJS for Beijing, CAN for Guangzhou)"),
    arrcity: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival city IATA 3-letter code (e.g. SHA for Shanghai, LAX for Los Angeles)"),
}, async ({ depcity, arrcity, depdate }) => {
    try {
        const flights = await flightService.getFlightTransferInfo(depcity, arrcity, depdate);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(flights, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error searching flights by number:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 注册工具: 获取航班舒适度指数
server.tool("flightHappinessIndex", "Use this tool when the user wants comfort-focused details for a known flight, such as punctuality, aircraft type, cabin configuration, seat comfort, meals, entertainment, or other onboard experience details. This tool works best when a specific flight number and date are already known. Do not use it for fare search, itinerary recommendation, or raw price comparison.", {
    fnum: z.string()
        .regex(/^[A-Z0-9]{2,3}[0-9]{1,4}$/)
        .describe("Flight number including airline code (e.g. MU2157, CZ3969)"),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If the user input contains only month and day, use getTodayDate to determine the year. For today's date, use getTodayDate instead of hardcoding."),
    dep: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure airport IATA 3-letter code (e.g. HFE for Hefei)")
        .optional(),
    arr: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival airport IATA 3-letter code (e.g. CAN for Guangzhou)")
        .optional(),
}, async ({ fnum, date, dep, arr }) => {
    try {
        const flights = await flightService.getFlightHappinessIndex(fnum, date, dep, arr);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(flights, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error searching flights by number:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
//注册工具：飞机实时位置查询
server.tool('getRealtimeLocationByAnum', 'Get realtime flight location by aircraft registration number, also called tail number, such as B2021 or B2022. Use this only when the aircraft registration number is known. If the registration number is unknown, first try to find the flight through searchFlightsByNumber and then use the aircraft registration number from that result.', {
    anum: z.string()
        .describe("Aircraft registration number, also called tail number, such as B2021, B2022, or B2023.")
}, async ({ anum }) => {
    try {
        const realtimeLocation = await flightService.getRealtimeLocationByAnum(anum);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(realtimeLocation, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error getting realtime location by anum:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 注册工具: 获取今天的日期
server.tool("getTodayDate", "Get today's date in local timezone (YYYY-MM-DD format). Use this tool whenever you need today's date - NEVER hardcode dates.", {
    random_string: z.string()
        .optional()
        .describe("Optional placeholder parameter. Normally omit it.")
}, async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    return {
        content: [
            {
                type: "text",
                text: todayDate
            }
        ]
    };
});
// 注册工具：获取机场天气
server.tool('getFutureWeatherByAirport', 'Get the 3-day airport weather forecast for today, tomorrow, and the day after tomorrow by airport IATA 3-letter code, such as PEK, SHA, CAN, or HFE.', {
    airport: z.string()
        .regex(/^[A-Z]{3}$/)
        .describe("Airport IATA 3-letter code (e.g. PEK for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei)")
}, async ({ airport }) => {
    try {
        const weather = await flightService.getAirportWeather(airport);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(weather, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error getting airport weather:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 注册工具：搜索航班方案
server.tool('searchFlightItineraries', 'Use this tool when the user wants a concise recommended itinerary summary in natural language. It returns a text-style result that summarizes how many sale flights match, the overall lowest price, the shortest duration, and several recommended options. Use city IATA 3-letter codes only. If the user instead needs structured raw flight pricing data with each flight and cabin price, use getFlightPriceByCities.', {
    depCityCode: z.string()
        .regex(/^[A-Z]{3}$/)
        .describe("Departure city 3-letter code (e.g. BJS for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei)"),
    depDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Departure date in YYYY-MM-DD format, for example 2025-07-04. IMPORTANT: If the user input contains only month and day, use getTodayDate to determine the year. For today's date, use getTodayDate instead of hardcoding."),
    arrCityCode: z.string()
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival city 3-letter code (e.g. BJS for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei)"),
}, async ({ depCityCode, depDate, arrCityCode }) => {
    try {
        const flightItineraries = await flightService.searchFlightItineraries(depCityCode, arrCityCode, depDate);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(flightItineraries, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error getting airport weather:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 注册工具：查询两个城市间的航班价格
server.tool('getFlightPriceByCities', 'Use this tool when the user needs structured raw pricing data. It returns sale flights between two cities as a list of flights, and each flight contains cabin entries with prices. This is better than searchFlightItineraries when the caller needs per-flight, per-cabin price details instead of a natural-language recommendation summary. All city codes must be valid IATA 3-letter codes (e.g. BJS for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei).', {
    dep_city: z.string()
        .regex(/^[A-Z]{3}$/)
        .describe("Departure city 3-letter code (e.g. BJS for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei)"),
    arr_city: z.string()
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival city 3-letter code (e.g. BJS for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei)"),
    dep_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Departure date in YYYY-MM-DD format, for example 2026-04-20. IMPORTANT: If the user input contains only month and day, use getTodayDate to determine the year. For today's date, use getTodayDate instead of hardcoding."),
}, async ({ dep_city, arr_city, dep_date }) => {
    try {
        const flightPrices = await flightService.getFlightPriceByCities(dep_city, arr_city, dep_date);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(flightPrices, null, 2)
                }
            ]
        };
    }
    catch (error) {
        console.error('Error getting flight prices by cities:', error);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});
// 连接传输并启动服务器
const transport = new StdioServerTransport();
// 启动服务器并处理错误
async function startServer() {
    try {
        await server.connect(transport);
    }
    catch (error) {
        process.exit(1);
    }
}
startServer().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
