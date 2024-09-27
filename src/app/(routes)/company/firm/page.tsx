"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { getCookie } from "cookies-next";
import { ICompany } from "@/interfaces/company.interface";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FirmPage() {
  const [token, setToken] = useState<string | null>(null);
  const [firmData, setFirmData] = useState<ICompany | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromCookie = getCookie('access_token') as string;
    setToken(tokenFromCookie);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchFirmData = async () => {
      try {
        const response = await fetch("https://ordemdeservicosdev.onrender.com/api/company/get-company", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFirmData(data);
      } catch (error) {
        setError("Erro ao buscar os dados da empresa. Por favor, tente novamente.");
        console.error("Erro ao buscar os dados da empresa:", error);
      }
    };

    fetchFirmData();
  }, [token]);

  const renderFirmInfo = () => {
    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (!firmData) {
      return <div>Loading...</div>;
    }

    return (
      <Container className="p-4">
			<main className="grid flex-1 items-start gap-8 sm:px-6 sm:py-0 md:gap-12">
				
          <Card className="border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="bg-white p-4 flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Perfil da Empresa</h1>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="border-b border-gray-300 pb-4 mb-4">
                <h2 className="text-xl font-semibold mb-4">Dados Gerais</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong className="font-medium">CNPJ:</strong> {firmData.cnpj}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium">Nome da Empresa:</strong> {firmData.companyName}
                  </p>
                  <Button
										variant="default"
										className="bg-blue-500 hover:bg-blue-600"
									>Enviar cadastro</Button>
                  {firmData.companyPhoto && (
                    <Image 
                      src={firmData.companyPhoto} 
                      alt="Logo da Empresa" 
                      width={100} 
                      height={100} 
                      className="w-24 mx-auto my-4 object-contain" 
                    />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Estrutura Organizacional</h3>
                <ul className="space-y-2">
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Funções: ${firmData.roles?.length || 0}`}</span></li>
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Ordens: ${firmData.Order?.length || 0}`}</span></li>
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Equipes: ${firmData.Team?.length || 0}`}</span></li>
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Usuários: ${firmData.User?.length || 0}`}</span></li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Grupos</h3>
                <ul className="space-y-2">
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Grupos Primários: ${firmData.primaries?.length || 0}`}</span></li>
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Grupos Secundários: ${firmData.secondaries?.length || 0}`}</span></li>
                  <li><span className="text-sm sm:text-base lg:text-xl font-semibold">{`Grupos Terciários: ${firmData.tertiaries?.length || 0}`}</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </Container>
    );
  };

  return renderFirmInfo();
}
