'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
   
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

 
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100; // convertendo valor para "centavos" apenas para evitar erro de banco
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices'); //Item 6: https://nextjs.org/learn/dashboard-app/mutating-data
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }







// DICAS createInvoice
/*
    Dica: Se você estiver trabalhando com formulários que possuem muitos campos,
    considere usar o métodoentries()método com JavaScriptObject.fromEntries().
    Por exemplo:
        const rawFormData = Object.fromEntries(formData.entries())
*/


/*
    new Date(): Isso cria um novo objeto Date em JavaScript que representa a data e a hora atuais.

    .toISOString(): Este método converte o objeto Date em uma string de caracteres no formato de
    data e hora ISO 8601, que é um padrão internacional para representar datas e horas.

    .split('T'): Este método divide a string em duas partes, usando 'T' como o delimitador.
    No formato ISO 8601, o 'T' separa a parte da data da parte da hora.
    Então, após este método, você terá um array com dois elementos:
    o primeiro representando a parte da data e o segundo representando a parte da hora.

    [0]: Isso acessa o primeiro elemento do array resultante,
    que é a parte da data no formato "AAAA-MM-DD".
*/
 