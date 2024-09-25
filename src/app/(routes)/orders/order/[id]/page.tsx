"use client";
import { AssignedTeam } from "@/components/assignedTeam";
import { Container } from "@/components/container";
import { OrderStatus } from "@/components/orderStatus";
import { IOrderGet } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getCookie } from "cookies-next";

export default function Page({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<IOrderGet>();
  const token = getCookie("access_token");

  useEffect(() => {
    fetch(
      `https://ordemdeservicosdev.onrender.com/api/order/get-order/${params.id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        const status = res.status;
        return res.json().then((data) => ({ status, data }));
      })
      .then(({ status, data }) => {
        console.log(status, data);
        setOrder(data);
      });
  }, [params.id, token]);

  return (
    <Container>
      <main className="flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        {order ? (
          <Card className="shadow-lg p-6 rounded-lg">
            <CardHeader className="border-b pb-4">
              <Link
                href="/orders"
                className=" text-white font-medium rounded mb-2 hover:-translate-y-1 transition-all w-fit inline-block"
              >
                <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                  Voltar
                </Button>
              </Link>
              <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="font-semibold text-2xl text-gray-800">
                  Ordem de Serviço - {order.orderId}
                </h1>
                <p className="text-gray-500 text-sm">
                  Data de abertura: {order.openningDate}
                </p>
              </div>
            </CardHeader>
					  <CardContent className="space-y-6">
						  <div className="mt-5">
							  
						  
              <h2 className="font-medium text-xl text-gray-800">
                {order.subject.name}
              </h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm max-w-md">{order.notes}</p>
                <OrderStatus
                  currentStatus={order.orderStatus.orderStatusName}
                  orderId={order.id}
                />
              </div>
				</div>
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-medium mb-2 text-gray-800">
                  Dados do solicitante
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <p>
                    <strong>Nome: </strong>
                    {order.requesterName}
                  </p>
                  <p>
                    <strong>Endereço: </strong>
                    {order.requesterStreet}
                  </p>
                  <p>
                    <strong>N°: </strong>
                    {order.requesterHouseNumber}
                  </p>
                  <p>
                    <strong>Complemento: </strong>
                    {order.requesterComplement}
                  </p>
                  <p>
                    <strong>Telefone/celular: </strong>
                    {order.requesterPhone}
                  </p>
                  <p>
                    <strong>CEP:</strong> {order.requesterZipcode}
                  </p>
                </div>
              </div>

              <AssignedTeam assignedTeam={order.assignedTeam} orderId={order.id} />
            </CardContent>
          </Card>
        ) : (
          <h1>Não há ordem de serviço com este id</h1>
        )}
      </main>
    </Container>
  );
}
