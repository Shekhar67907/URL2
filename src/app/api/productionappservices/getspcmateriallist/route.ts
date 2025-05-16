import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.1.7:8304";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fromDate = url.searchParams.get('FromDate');
    const toDate = url.searchParams.get('ToDate');
    const shiftId = url.searchParams.get('ShiftId');

    if (!fromDate || !toDate || !shiftId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${BASE_URL}/api/productionappservices/getspcmateriallist`,
      {
        params: {
          FromDate: fromDate,
          ToDate: toDate,
          ShiftId: shiftId
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching material list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data?.message || error.message },
          { status: error.response.status }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to fetch material list" },
      { status: 500 }
    );
  }
}