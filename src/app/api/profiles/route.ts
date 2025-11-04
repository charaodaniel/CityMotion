import { NextResponse, NextRequest } from 'next/server';

/**
 * Esta API simulada foi descontinuada.
 * A lógica de gerenciamento de perfis foi movida para ser tratada diretamente 
 * no banco de dados (ver src/data/database.sql).
 * 
 * Em uma implementação de backend real, esta rota faria a conexão
 * com o banco de dados para atualizar o campo 'role' do funcionário.
 * 
 * Exemplo de como seria com uma biblioteca como 'sqlite':
 * 
 * import db from '@/lib/db'; // hypothetical db connection
 * 
 * export async function POST(request: NextRequest) {
 *   const { employeeId, newRole } = await request.json();
 *   
 *   try {
 *     const stmt = db.prepare('UPDATE employees SET role = ? WHERE id = ?');
 *     stmt.run(newRole, employeeId);
 *     
 *     // Retornar o funcionário atualizado e a lista completa
 *     const updatedEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(employeeId);
 *     const employees = db.prepare('SELECT * FROM employees').all();
 * 
 *     return NextResponse.json({
 *       message: 'Profile updated successfully in the database.',
 *       updatedEmployee,
 *       employees
 *     });
 *   } catch (error) {
 *     return new NextResponse('Database error.', { status: 500 });
 *   }
 * }
 */

export async function POST(request: NextRequest) {
  
  console.log("A API /api/profiles foi chamada, mas está desativada. A lógica agora deve ser implementada no backend com o banco de dados.");

  // Retornar um erro informativo para o desenvolvedor
  return new NextResponse(
    JSON.stringify({ 
      message: 'Esta API foi descontinuada. A atualização de perfis deve ser implementada no servidor Node.js que se conecta ao banco de dados SQLite.'
    }), 
    { 
      status: 501, // 501 Not Implemented
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
