import { NextResponse } from "next/server";
import { NexusBridge } from "@/nexusbridge/core/engine";
const bridge = new NexusBridge();
async function GET(request, { params }) {
  const { nexusPath } = await params;
  const path = nexusPath.join("/");
  const result = await bridge.handleRequest({
    path,
    method: "GET",
    headers: Object.fromEntries(request.headers)
  });
  return NextResponse.json(result.data, { status: result.status });
}
async function POST(request, { params }) {
  const { nexusPath } = await params;
  const path = nexusPath.join("/");
  const body = await request.json().catch(() => ({}));
  const result = await bridge.handleRequest({
    path,
    method: "POST",
    body,
    headers: Object.fromEntries(request.headers)
  });
  return NextResponse.json(result.data, { status: result.status });
}
async function PUT(request, { params }) {
  const { nexusPath } = await params;
  const path = nexusPath.join("/");
  const body = await request.json().catch(() => ({}));
  const result = await bridge.handleRequest({
    path,
    method: "PUT",
    body,
    headers: Object.fromEntries(request.headers)
  });
  return NextResponse.json(result.data, { status: result.status });
}
async function DELETE(request, { params }) {
  const { nexusPath } = await params;
  const path = nexusPath.join("/");
  const result = await bridge.handleRequest({
    path,
    method: "DELETE",
    headers: Object.fromEntries(request.headers)
  });
  return NextResponse.json(result.data, { status: result.status });
}
export {
  DELETE,
  GET,
  POST,
  PUT
};
