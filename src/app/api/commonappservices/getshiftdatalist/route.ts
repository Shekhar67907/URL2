import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.1.7:8304";

export async function GET() {
  try {
    // Make API call to external service
    const response = await axios.get(
      `${BASE_URL}/api/commonappservices/getshiftdatalist`
    );

    // Validate response data
    if (!response.data) {
      throw new Error("No data received from API");
    }

    // Process the data to ensure ShiftId is a number
    const processedData = Array.isArray(response.data) 
      ? response.data.map(shift => ({
          ...shift,
          ShiftId: Number(shift.ShiftId)
        }))
      : [];

    // Return the processed data
    return NextResponse.json(processedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching shift data:", error);
    
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { error: `API Error: ${error.response.data?.message || error.message}` },
          { status: error.response.status }
        );
      } else if (error.request) {
        return NextResponse.json(
          { error: "No response received from API" },
          { status: 503 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: "Failed to fetch shift data" },
      { status: 500 }
    );
  }
} 