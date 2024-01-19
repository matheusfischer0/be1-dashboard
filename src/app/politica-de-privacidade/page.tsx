import React from "react";
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Política de Privacidade - BE1 Tecnologia</title>
      </Head>

      <main className="bg-gray-100 min-h-screen min-w-screen p-5">
        <section className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Política de Privacidade da BE1 Tecnologia
          </h1>
          <p className="mb-2 text-gray-600">Última atualização: 19/01/2024</p>

          {/* Each section of the policy */}
          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              1. Coleta de Informações
            </h2>{" "}
            <p className="text-gray-700 mb-2">
              Coletamos informações que identificam você (Dados Pessoais) de
              diversas formas:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-decimal align-top pl-4">
              <li>
                Informações fornecidas pelo usuário: Coletamos dados pessoais
                fornecidos diretamente por você, como nome, e-mail, número de
                telefone, etc.
              </li>
              <li>
                Dados de uso: Informações sobre como você utiliza nosso
                aplicativo, incluindo interações com a interface e
                funcionalidades.
              </li>
              <li>
                Dados técnicos: Informações técnicas sobre o dispositivo
                utilizado, tais como sistema operacional e endereço IP.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              2. Uso das Informações
            </h2>
            <p className="text-gray-700 mb-2">
              Os Dados Pessoais coletados podem ser utilizados para:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-decimal align-top pl-4">
              <li>Fornecer, manter e melhorar nossos serviços.</li>
              <li>Processar transações e enviar notificações relacionadas.</li>
              <li>Responder a consultas e oferecer suporte ao cliente.</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              3. Compartilhamento de Informações
            </h2>
            <p className="text-gray-700 mb-2">
              Podemos compartilhar seus Dados Pessoais nas seguintes
              circunstâncias:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-decimal align-top pl-4">
              <li>
                Prestadores de serviços: Compartilhamos informações com empresas
                que nos prestam serviços, sob estritos termos de
                confidencialidade.
              </li>
              <li>
                Requisitos legais: Quando necessário para cumprir com leis,
                regulamentos, processos judiciais, ou solicitações
                governamentais.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              4. Segurança dos Dados
            </h2>
            <p className="text-gray-700 mb-2">
              Empregamos medidas de segurança para proteger seus dados,
              incluindo:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-decimal align-top pl-4">
              <li>Criptografia de dados em trânsito e armazenados.</li>
              <li>Sistemas e processos de segurança da informação.</li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              5. Seus Direitos
            </h2>
            <p className="text-gray-700 mb-2">
              Conforme a LGPD, você tem o direito de:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-decimal align-top pl-4">
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>
                Solicitar anonimização, bloqueio ou eliminação de dados
                desnecessários.
              </li>
              <li>
                Solicitar a portabilidade de dados a outro fornecedor de serviço
                ou produto.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              6. Alterações na Política de Privacidade
            </h2>
            <p className="text-gray-700 mb-2">
              Esta política pode ser atualizada. Informaremos sobre quaisquer
              mudanças através dos nossos canais habituais de comunicação.
            </p>
          </article>

          <article className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              7. Contato
            </h2>
            <p className="text-gray-600">
              Em caso de dúvidas ou solicitações relacionadas a esta política,
              entre em contato conosco através do e-mail:{" "}
              <a
                href="mailto:be1@be1.com.br"
                className="text-blue-600 hover:text-blue-800"
              >
                be1@be1.com.br
              </a>
              .
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
