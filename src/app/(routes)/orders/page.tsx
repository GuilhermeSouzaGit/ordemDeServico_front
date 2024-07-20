"use client";
import { Container } from "@/components/container";
import { OrderStatus } from "@/components/orderStatus";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

export default function Page() {
	const [orders, setOrders] = useState<Order[]>([]);
	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/order/get-all-orders",
			{
				method: "GET",
			}
		)
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				setOrders(data);
			});
	}, []);

	const truncateNotes = (notes: string, maxLength: number) => {
		if (notes.length > maxLength) {
			return notes.substring(0, maxLength) + "...";
		}
		return notes;
	};

	return (
		<div>
			<h1 className="font-semibold text-xl">Ordens de serviço</h1>
			<Container>
				<div className="flex justify-between text-xs sm:text-base">
					<input
						type="search"
						name=""
						id=""
						placeholder="Pesquisar ordem"
						className="border border-[#E7E7E7] px-2 outline-none"
					/>
					<Link
						href="/orders/create-order"
						className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all"
					>
						Cadastrar OS
					</Link>
				</div>
				<div className="mt-4 md:mt-8">
					<ul className="flex justify-around xl:justify-normal xl:gap-32 text-xs sm:text-base">
						<li
							className={`hover:text-[#7F56D8] cursor-pointer font-medium`}
						>
							Ver todas
						</li>
						<li className="hover:text-[#7F56D8] cursor-pointer font-medium">
							Novas
						</li>
						<li className="hover:text-[#7F56D8] cursor-pointer font-medium">
							Em andamento
						</li>
						<li className="hover:text-[#7F56D8] cursor-pointer font-medium">
							Resolvidas
						</li>
					</ul>
					{orders.map((orders, index) => (
						<div
							className="mt-4 border border-[#e2e2e2] py-2 px-4 rounded flex flex-col gap-2"
							key={index}
						>
							<div className="flex justify-between items-center">
								<Link
									href={`/orders/order/${orders.id}`}
									className="hover:text-[#2c5cc5]"
								>
									<h1 className="font-semibold text-sm md:text-xl">
										Ordem de Serviço - {orders.orderId}
									</h1>
								</Link>
								<p className="text-[#84818A] text-[.6rem] md:text-xs text-right">
									Data de abertura: {orders.openningDate}
								</p>
							</div>
							<h1 className="font-medium text-xs sm:text-base">
								{orders.subject}
							</h1>
							<div className="flex justify-between items-center">
								<p className="text-[#84818A] text-[.6rem] md:text-xs">
									{truncateNotes(orders.notes, 200)}
								</p>
								<OrderStatus status={orders.orderStatus} />
							</div>
						</div>
					))}
				</div>
			</Container>
		</div>
	);
}
