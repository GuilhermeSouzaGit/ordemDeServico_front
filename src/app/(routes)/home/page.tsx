"use client";
import { Container } from "@/components/container";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input";
interface Order {
	id: string;
	orderId: number;
	openningDate: string;
	expirationDate: string;
	orderStatus: string;
	subject: string;
	notes: string;
	requesterName: string;
	requesterPhone: string;
	requesterStreet: string;
	requesterHouseNumber: number;
	requesterComplement: string;
	requesterZipcode: string;
	teamId: string;
	createdAt: string;
	updatedAt: string;
	assignedTeam: {
		id: string;
		teamLeaderId: string;
		teamName: string;
		createdAt: string;
		updatedAt: string;
	};
}
export default function Home() {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/order/get-all-orders",
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiIxNTdhODg5MC1hYjBkLTQ1YWQtOTM2ZS0xYTg5ZjlmOWYzNTMiLCJyb2xlSWQiOiIzYThlMGEwMy03YWE0LTQ2MjktYWRlMS04ODE5YzdjYmMxOTYiLCJpYXQiOjE3MjQyNDMzNDd9.tB6DOfAN1TmILIvIdx6hYy2ENWOooCml6fFEeNmokGA`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setOrders(data);
				} else {
					console.error("Resposta da API não é um array:", data);
				}
			})
			.catch((error) => {
				console.error("Erro ao buscar ordens:", error);
			});
	}, []);

	const totalOrders = orders.length;
	const openOrders = orders.filter(
		(order) => order.orderStatus === "Aberto"
	).length;
	const inProgressOrders = orders.filter(
		(order) => order.orderStatus === "Em andamento"
	).length;

	const today = new Date().toLocaleDateString("pt-BR");

	const ordersOpenedToday = orders.filter((order) => {
		const [orderDate] = order.openningDate.split(", ");
		return orderDate === today;
	}).length;

	const ordersDelayed = orders.filter((order) => {
		const newToday = new Date();
		const [day, month, year] = order.expirationDate
			.split(", ")[0]
			.split("/");
		const expirationDate = new Date(`${year}-${month}-${day}`);

		return newToday.getTime() > expirationDate.getTime();
	}).length;

	return (
		<Container>
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Seja bem-vindo, Débora Almeida.</CardTitle>
								<CardDescription className="max-w-[90ch]">Cheque todas as informações, navegue por todas as abas e acostume-se com esse gerenciamento de tarefas. Tudo didático e aprimorado. Abaixo, cheque algumas informações sobre o que você terá acesso aqui na plataforma:</CardDescription>
							  <div className="flex items-center justify-between">
								
							  <div className="relative flex-1 md:grow-0">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="search"
										placeholder="Pesquisar..."
										className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
									/>
								</div>
								</div>
							</CardHeader>
							<div className="p-3">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							<div className="p-4 bg-blue-500 text-white rounded shadow">
								<h2 className="text-lg font-bold">Total de Ordens</h2>
								<p className="text-2xl">{totalOrders}</p>
							</div>
							<div className="p-4 bg-green-500 text-white rounded shadow">
								<h2 className="text-lg font-bold">Ordens em Aberto</h2>
								<p className="text-2xl">{openOrders}</p>
							</div>
							<div className="p-4 bg-yellow-500 text-white rounded shadow">
								<h2 className="text-lg font-bold">Ordens em Andamento</h2>
								<p className="text-2xl">{inProgressOrders}</p>
							</div>
							<div className="p-4 bg-gray-500 text-white rounded shadow">
								<h2 className="text-lg font-bold">Ordens Abertas Hoje</h2>
								<p className="text-2xl">{ordersOpenedToday}</p>
							</div>
							<div className="p-4 bg-red-500 text-white rounded shadow">
								<h2 className="text-lg font-bold">Ordens em Atraso</h2>
								<p className="text-2xl">{ordersDelayed}</p>
							</div>
						</div>
							</div>
							
						
						</Card>
					</TabsContent>
				</Tabs>
			</main>
			
		</Container>
	);
}
