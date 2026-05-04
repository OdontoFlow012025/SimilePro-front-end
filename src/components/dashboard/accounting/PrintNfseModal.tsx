"use client";

import React from "react";

const formatCurrency = (val: number) => {
    if (typeof val !== 'number') return "R$ 0,00";
    return "R$ " + val.toLocaleString('pt-BR', {minimumFractionDigits:2});
}

type PrintNfseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nf: any | null;
  dict: any;
};

export default function PrintNfseModal({ isOpen, onClose, nf, dict }: PrintNfseModalProps) {
  if (!isOpen || !nf || !dict) return null;
  const pDict = dict.nfsePrint;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-nfse, #printable-nfse * {
            visibility: visible;
          }
          #printable-nfse {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}} />

      <div className="fixed inset-0 z-[100] flex items-start justify-center bg-gray-500/80 p-4 sm:p-8 overflow-y-auto" onClick={onClose}>
        <div className="bg-white max-w-4xl w-full shadow-2xl relative flex flex-col print:shadow-none print:bg-transparent" onClick={e => e.stopPropagation()}>
          
          {/* Header controls for screen only */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50 print-hide">
             <div className="text-gray-600 font-medium">{pDict.viewTitle}</div>
             <div className="flex gap-2">
                 <button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm"
                 >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    {pDict.printSave}
                 </button>
                 <button 
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700 text-black px-4 py-2 rounded-lg font-bold flex items-center justify-center transition"
                 >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                 </button>
             </div>
          </div>

          {/* Printable Document */}
          <div id="printable-nfse" className="p-8 sm:p-12 text-black bg-white">
            
            {/* Cabecalho NFSe */}
            <div className="border-4 border-black p-4 flex flex-col md:flex-row justify-between items-center mb-6">
               <div className="flex items-center gap-4">
                  <div className="size-16 sm:size-24 border border-black flex items-center justify-center text-center p-2 font-serif text-[10px] sm:text-xs font-bold uppercase">
                     {pDict.coatOfArms}
                  </div>
                  <div>
                      <h1 className="font-bold text-lg sm:text-xl uppercase">{pDict.cityHall}</h1>
                      <h2 className="font-bold text-sm sm:text-lg uppercase">{pDict.title}</h2>
                  </div>
               </div>
               <div className="text-right mt-4 md:mt-0">
                  <div className="font-bold text-lg">{pDict.number} {nf.numero}</div>
                  <div className="font-bold text-sm text-gray-700">{pDict.date} {new Date(nf.createdAt).toLocaleDateString('pt-BR')}</div>
                  <div className="font-bold text-sm text-gray-700">{pDict.verificationCode} <span className="uppercase tracking-widest">{nf.id?.toString().slice(-4) || "AAAA"}-{Math.random().toString(36).substring(2,6).toUpperCase()}</span></div>
               </div>
            </div>

            {/* PRESTADOR */}
            <div className="border border-black mb-6">
                <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs uppercase uppercase">{pDict.provider}</div>
                <div className="p-3 text-sm">
                    <p><strong>Clínica OdontoFlow LTDA</strong></p>
                    <p>CNPJ: 00.000.000/0001-00</p>
                    <p>Inscrição Municipal: 12345/00</p>
                    <p>Endereço: Av. Principal, 1000 - Centro - Cidade/UF</p>
                </div>
            </div>

            {/* TOMADOR */}
            <div className="border border-black mb-6">
                <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs uppercase uppercase">{pDict.taker}</div>
                <div className="p-3 text-sm">
                    <p><strong>{nf.faturaId ? pDict.pacient : pDict.consumer}</strong></p>
                    {nf.faturaId ? (
                        <>
                           <p>{pDict.cpfCnpj} ***.***.***-**</p>
                           <p>{pDict.refInvoice} {nf.faturaId}</p>
                        </>
                    ) : (
                        <p>{pDict.cpfCnpj} {pDict.notInformed}</p>
                    )}
                </div>
            </div>

            {/* DESCRIÇÃO DOS SERVIÇOS */}
            <div className="border border-black mb-6 min-h-[150px]">
                <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs uppercase uppercase">{pDict.description}</div>
                <div className="p-4 text-sm whitespace-pre-wrap">
                    {nf.descricao || pDict.defaultDesc}
                </div>
            </div>

            {/* CÓDIGO DO SERVIÇO E IMPOSTOS */}
            <div className="border border-black mb-6 flex flex-col md:flex-row text-sm">
                <div className="p-3 flex-1 border-b md:border-b-0 md:border-r border-black">
                    <div className="font-bold mb-1 uppercase text-xs">{pDict.serviceCode}</div>
                    <div>{nf.codigoServico || "04.01"} - {nf.itemLc116 || "Medicina e biomedicina"}</div>
                </div>
                <div className="p-3 flex-1 border-b md:border-b-0 md:border-r border-black">
                    <div className="font-bold mb-1 uppercase text-xs">{pDict.monthYear}</div>
                    <div>{new Date(nf.createdAt).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}</div>
                </div>
                <div className="p-3 flex-1">
                    <div className="font-bold mb-1 uppercase text-xs">{pDict.location}</div>
                    <div>{pDict.fixedLocation}</div>
                </div>
            </div>

            {/* VALORES E RETENÇÕES */}
            <div className="border border-black flex flex-col md:flex-row text-center text-sm font-bold divide-y md:divide-y-0 md:divide-x divide-black bg-gray-50">
                <div className="flex-1 p-2">
                    <div className="text-xs uppercase text-gray-600 mb-1">{pDict.deductions}</div>
                    <div>0,00</div>
                </div>
                <div className="flex-1 p-2">
                    <div className="text-xs uppercase text-gray-600 mb-1">{pDict.discount}</div>
                    <div>0,00</div>
                </div>
                <div className="flex-1 p-2">
                    <div className="text-xs uppercase text-gray-600 mb-1">{pDict.calcBase}</div>
                    <div>{formatCurrency(nf.valorTotal)}</div>
                </div>
                <div className="flex-1 p-2 text-red-700">
                    <div className="text-xs uppercase text-red-600 mb-1">{pDict.issRate}</div>
                    <div>{nf.aliquota?.toFixed(2) || "3.5"}%</div>
                </div>
                <div className="flex-1 p-2 text-red-700">
                    <div className="text-xs uppercase text-red-600 mb-1">{pDict.issValue}</div>
                    <div>{formatCurrency(nf.valorIss)}</div>
                </div>
            </div>
            
            <div className="border-x border-b border-black flex flex-col md:flex-row text-center text-sm font-bold divide-y md:divide-y-0 md:divide-x divide-black bg-blue-50">
                <div className="flex-[3] p-4 text-left">
                    <div className="text-xs uppercase text-gray-600 mb-1">{pDict.netValue}</div>
                    <div className="text-lg">{formatCurrency(nf.valorTotal)}</div>
                </div>
                <div className="flex-1 p-4 bg-gray-200">
                    <div className="text-xs uppercase text-black mb-1">{pDict.issRetained}</div>
                    <div>{nf.issRetido ? pDict.yes : pDict.no}</div>
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] sm:text-xs text-gray-500 font-mono">
                {pDict.footer1}<br/>
                {pDict.footer2}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
