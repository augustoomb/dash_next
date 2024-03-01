import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
};

/* 
EXPLICAÇÃO: FOI DESCONSTRUÍDO DE DENTRO DE PROPS UM OBJ CHAMADO searchParams
O TIPO DO PARAMETRO searchParams É searchParams, QUE É OPCIONAL
e pode conter um objeto com duas chaves possíveis: query e page,
ambas opcionalmente do tipo string.
*/
export default async function Page({searchParams,}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

/*
Usa o componente Suspense para envolver o componente Table.
O Suspense define um fallback (um conteúdo de carregamento)
que é mostrado enquanto o conteúdo principal está sendo carregado. 
Ele usa a chave {query + currentPage} para garantir que, quando a 
chave muda (por exemplo, quando a consulta ou a página atual muda), 
o componente Table seja atualizado e o fallback seja exibido novamente se necessário.
*/
