#!/usr/bin/env node
import { z } from 'zod';
import { OpenAlService } from './services/openalService.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const flightService = new OpenAlService();
// 创建服务器
const server = new McpServer({
    name: "variflight-mcp",
    version: "0.0.1",
});
// 注册工具: 通过出发地和目的地查询航班
server.tool("searchFlightsByDepArr", "Search flights by departure and arrival airports and date. Date format: YYYY-MM-DD. IMPORTANT: For today's date, you MUST use getTodayDate tool instead of hardcoding any date. Airport codes should be IATA 3-letter codes (e.g. PEK for Beijing, SHA for Shanghai). ", {
    dep: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure airport IATA 3-letter code (e.g. PEK for Beijing, CAN for Guangzhou)"),
    arr: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival airport IATA 3-letter code (e.g. SHA for Shanghai, HFE for Hefei)"),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If user input only cotains month and date, you should use getTodayDate tool to get the year. For today's date, use getTodayDate tool instead of hardcoding")
}, async ({ dep, arr, date }) => {
    try {
        const flights = await flightService.getFlightsByDepArr(dep, arr, date);
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
server.tool("searchFlightsByNumber", "Search flights by flight number and date. Flight number should include airline code (e.g. MU2157, CZ3969).  dep and arr are optional, keep empty if you don't know them. Date format: YYYY-MM-DD. IMPORTANT: For today's date, you MUST use getTodayDate tool instead of hardcoding any date. Airport codes (optional) should be IATA 3-letter codes. ", {
    fnum: z.string()
        .regex(/^[A-Z0-9]{2,3}[0-9]{1,4}$/)
        .describe("Flight number including airline code (e.g. MU2157, CZ3969)"),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If user input only cotains month and date, you should use getTodayDate tool to get the year. For today's date, use getTodayDate tool instead of hardcoding"),
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
server.tool("getFlightTransferInfo", "Get flight transfer info by departure city and arrival city and departure date. Date format: YYYY-MM-DD. IMPORTANT: For today's date, you MUST use getTodayDate tool instead of hardcoding any date. Airport codes should be IATA 3-letter codes. ", {
    depdate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If user input only cotains month and date, you should use getTodayDate tool to get the year. For today's date, use getTodayDate tool instead of hardcoding"),
    depcity: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Departure airport IATA 3-letter code (e.g. BJS for Beijing, CAN for Guangzhou)"),
    arrcity: z.string()
        .length(3)
        .regex(/^[A-Z]{3}$/)
        .describe("Arrival airport IATA 3-letter code (e.g. SHA for Shanghai, LAX for Los Angeles)"),
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
server.tool("flightHappinessIndex", "using this tool when you need information related to following topics: Detailed flight comparisons (punctuality, amenities, cabin specs),Health safety protocols for air travel,Baggage allowance verification,Environmental impact assessments,Aircraft configuration visualization,Comfort-focused trip planning (seat dimensions, entertainment, food). etc.", {
    fnum: z.string()
        .regex(/^[A-Z0-9]{2,3}[0-9]{1,4}$/)
        .describe("Flight number including airline code (e.g. MU2157, CZ3969)"),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe("Flight date in YYYY-MM-DD format. IMPORTANT: If user input only cotains month and date, you should use getTodayDate tool to get the year. For today's date, use getTodayDate tool instead of hardcoding"),
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
server.tool('getRealtimeLocationByAnum', 'Get flight realtime location by aircraft number. aircraft number should be Aircraft registration numberlike B2021, B2022, B2023, etc. if aircraft number is unknown, you shuold try to request it using searchFlightsByNumber tool', {
    anum: z.string()
        .describe("Aircraft number like B2021, B2022, B2023, etc.")
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
        .describe("Dummy parameter for no-parameter tools")
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
server.tool('getFutureWeatherByAirport', 'Get airport future weather for 3days (today、tomorrow、the day after tomorrow) by airport IATA 3-letter code. Airport codes should be IATA 3-letter codes (e.g. PEK for Beijing, SHA for Shanghai, CAN for Guangzhou, HFE for Hefei).', {
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
