import dotenv from 'dotenv';
dotenv.config();
export const config = {
    server: {
        name: 'variflight-mcp',
        version: '0.0.1',
    },
    api: {
        baseUrl: process.env.VARIFLIGHT_API_URL || 'https://mcp.variflight.com/api/v1/mcp/data',
        apiKey: process.env.X_VARIFLIGHT_KEY || process.env.VARIFLIGHT_API_KEY,
    },
};
