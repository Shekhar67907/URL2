import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.1.7:8304";

export async function GET(request: Request) {
  try {
    // Parse URL parameters
    const url = new URL(request.url);
    const fromDate = url.searchParams.get('FromDate');
    const toDate = url.searchParams.get('ToDate');
    const materialCode = url.searchParams.get('MaterialCode');
    const operationCode = url.searchParams.get('OperationCode');
    const gaugeCode = url.searchParams.get('GuageCode');
    const shiftId = url.searchParams.get('ShiftId');

    // Validate required parameters
    if (!fromDate || !toDate || !materialCode || !operationCode || !gaugeCode || !shiftId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Make real API call to external service
    const response = await axios.get(
      `${BASE_URL}/api/productionappservices/getspcpirinspectiondatalist`,
      {
        params: {
          FromDate: fromDate,
          ToDate: toDate,
          MaterialCode: materialCode,
          OperationCode: operationCode,
          GuageCode: gaugeCode,
          ShiftId: shiftId
        }
      }
    );

    // Return the actual API response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching PIR inspection data:", error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data?.message || error.message },
          { status: error.response.status }
        );
      } else if (error.request) {
        return NextResponse.json(
          { error: "No response received from API" },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch PIR inspection data" },
      { status: 500 }
    );
  }
}