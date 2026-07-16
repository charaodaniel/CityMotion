import { NextResponse } from "next/server";
async function POST(request) {
  console.log("A API /api/profiles foi chamada, mas est\xE1 desativada. A l\xF3gica agora deve ser implementada no backend com o banco de dados.");
  return new NextResponse(
    JSON.stringify({
      message: "Esta API foi descontinuada. A atualiza\xE7\xE3o de perfis deve ser implementada no servidor Node.js que se conecta ao banco de dados SQLite."
    }),
    {
      status: 501,
      // 501 Not Implemented
      headers: { "Content-Type": "application/json" }
    }
  );
}
export {
  POST
};
