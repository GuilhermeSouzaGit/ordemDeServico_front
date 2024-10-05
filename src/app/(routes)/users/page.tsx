"use client";
import { Container } from "@/components/container";
import { useRouter } from "next/navigation";
import { IUser } from "@/interfaces/user.interface";
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICreateUserRequest } from "@/interfaces/create-user-request/createUser.interface";
import { toast } from "react-toastify";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MoneyFormatter from "@/components/formatMoneyValues";
import { FaEdit } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function Page() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [user, setUser] = useState<IUser>();
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [userId, setUserId] = useState("");
	const token = getCookie("access_token");
	const router = useRouter();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const inputElement = getInput("sheetFile");

		if (inputElement && inputElement.files && inputElement.files[0]) {
			const formData = new FormData();
			formData.append("sheetFile", inputElement.files[0]);

			toast.promise(
				fetch(`https://ordemdeservicosdev.onrender.com/api/user/import-users`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				})
					.then((res) => {
						if (res.ok) {
							return res.json();
						}
					})
					.then((data) => {
						console.log(data);
					})
					.catch((error) => {
						console.log(error);
					}),
				{
					pending: "Importando...",
					success: {
						render: "Importação de usuários concluída",
						onClose: () => {
							window.location.reload();
						},
						autoClose: 1500,
					},
					error: "Ocorreu um erro ao importar",
				}
			);
		}
	};

	const createEmployee = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: {
			name: string;
			phone: string;
		} = {
			name: getInput("name").value || "",
			phone: getInput("phone").value || "",
		};

		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/user/create-user/bea03c80-6d96-4514-a15f-eae6c3df042a?type=employee`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(request),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Cadastrando funcionário...",
				success: {
					render: "Funcionário cadastrado com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao cadastrar o funcionário",
			}
		);
	};

	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const limit = 10;
			const offset = limit * (currentPage - 1);

			const response = await fetch(`https://ordemdeservicosdev.onrender.com/api/user/get-all-users?limit=${limit}&offset=${offset}`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (Array.isArray(data.users)) {
				setUsers(data.users);
				setTotalPages(data.pages);
			} else {
				setError("Dados recebidos não são um array.");
			}
		} catch (error: Error | any) {
			setError(error.message || "Erro ao carregar os usuários");
		} finally {
			setIsLoading(false);
		}
	};

	const getUser = async (userId: string) => {
		await fetch(`https://ordemdeservicosdev.onrender.com/api/user/get-user/${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setUser(data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const editUser = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: {
			name?: string;
			email?: string;
			phone?: string;
			cpf?: string;
			startCompanyDate?: string;
		} = {
			name: getInput("name").value || "",
			phone: getInput("phone").value || "",
			cpf: getInput("cpf").value || "",
			startCompanyDate: getInput("startCompanyDate").value ? new Date(getInput("startCompanyDate").value).toISOString() : undefined,
		};

		if (user?.isUser) {
			request.email = getInput("email").value || "";
		}

		Object.keys(request).forEach((key) => {
			if (!request[key as keyof typeof request]) {
				delete request[key as keyof typeof request];
			}
		});

		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/user/edit-user/${user?.id}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
			})
				.then(async (res) => {
					if (res.status === 400) {
						const data = await res.json();
						toast.error(data.message);
						throw new Error(data.message);
					}
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
					throw error;
				}),
			{
				pending: "Editando...",
				success: {
					render: "Editado com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao editar",
			}
		);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	useEffect(() => {
		fetchUsers();
	}, [currentPage, token]);

	return (
		<Container className="p-4 overflow-x-auto">
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				{isLoading ? (
					<div className="flex justify-center items-center">
						<svg
							className="h-8 w-8 animate-spin text-gray-600 mx-auto"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					</div>
				) : (
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Usuários/Funcionários</CardTitle>
											<CardDescription>Cheque todas as informações relacionadas aos usuários e funcionários.</CardDescription>
										</div>
										<div className="flex gap-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Importar Funcionários
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Importar Funcionários</DialogTitle>
														<DialogDescription>Envie uma planilha contendo os funcionários.</DialogDescription>
													</DialogHeader>
													<form
														action="#"
														onSubmit={(e) => onSubmit(e)}
														className=" flex flex-col justify-center items-center"
													>
														<div className="flex gap-3 flex-col items-center max-w-96 w-full">
															<Input type="file" name="sheetFile" placeholder="Envie uma planilha" className="w-full" />
															<Button
																className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
																type="submit"
															>
																Criar
															</Button>
														</div>
													</form>
												</DialogContent>
											</Dialog>
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Cadastrar Funcionário
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Cadastrar Funcionário</DialogTitle>
														<DialogDescription>Cadastre um funcionário no sistema.</DialogDescription>
													</DialogHeader>
													<form
														action="#"
														onSubmit={(e) => createEmployee(e)}
														className=" flex flex-col justify-center items-center"
													>
														<div className="flex gap-3 flex-col items-center max-w-96 w-full">
															<Input type="text" name="name" placeholder="Nome do Funcionário" className="w-full" />
															<Input
																type="text"
																name="phone"
																placeholder="Telefone do Funcionário"
																className="w-full"
															/>
															<Button
																className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
																type="submit"
															>
																Criar
															</Button>
														</div>
													</form>
												</DialogContent>
											</Dialog>
										</div>
									</div>
								</CardHeader>

								<div className="p-3">
									<div className="w-full overflow-x-auto">
										<Table className="min-w-[600px] bg-white shadow-md rounded-lg">
											<TableHeader>
												<TableRow>
													<TableHead className="font-bold">Nome</TableHead>
													<TableHead className="font-bold">Email</TableHead>
													<TableHead className="font-bold">Telefone</TableHead>
													<TableHead className="font-bold">Cargo</TableHead>
													<TableHead className="font-bold">Usuário</TableHead>
													<TableHead className="font-bold">Salário</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{isLoading ? (
													<TableRow>
														<TableCell colSpan={5} className="text-center">
															<svg
																className="h-8 w-8 animate-spin text-gray-600 mx-auto"
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth={2}
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
																/>
															</svg>
														</TableCell>
													</TableRow>
												) : error ? (
													<TableRow>
														<TableCell colSpan={5} className="text-center text-red-500">
															{error}
														</TableCell>
													</TableRow>
												) : (
													users.map((user, index) => (
														<TableRow key={index} className="border-b">
															<TableCell>{user.name}</TableCell>
															<TableCell>{user.email}</TableCell>
															<TableCell>{user.phone}</TableCell>
															<TableCell>{user.role?.roleName}</TableCell>
															<TableCell>{user.isUser ? "Sim" : "Não"}</TableCell>
															<TableCell>
																<MoneyFormatter value={user.salary || 0} />
															</TableCell>
															<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/users/${user.id}`)}>
																<Button variant="outline">Ver dados</Button>
															</TableCell>
															<TableCell
																style={{ cursor: "pointer" }}
																onClick={() => {
																	setIsEditing(true), getUser(user.id);
																}}
															>
																<FaEdit
																	className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
																	size={20}
																/>
															</TableCell>
														</TableRow>
													))
												)}
											</TableBody>
										</Table>
										<Dialog
											open={isEditing}
											onOpenChange={(isOpen) => {
												setIsEditing(isOpen);
												if (!isOpen) {
													setUser(undefined);
												}
											}}
										>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>Editar Usuário</DialogTitle>
													<DialogDescription>Edite os dados desse usuário abaixo</DialogDescription>
												</DialogHeader>
												{user && (
													<form action="#" onSubmit={(e) => editUser(e)} className="flex flex-col gap-2">
														<Input type="text" name="name" defaultValue={user.name} placeholder="Digite aqui o nome" />
														<Input
															type="tel"
															name="phone"
															defaultValue={user.phone}
															placeholder="Digite aqui o telefone"
														/>
														{user.isUser ? (
															<Input
																type="email"
																name="email"
																defaultValue={user.email}
																placeholder="Digite aqui o email"
															/>
														) : (
															""
														)}
														<Input type="text" name="cpf" defaultValue={user.cpf} placeholder="Digite aqui o CPF" />
														<Label htmlFor="startCompanyDate">Data de início na empresa:</Label>
														<Input
															type="date"
															name="startCompanyDate"
															defaultValue={formatDate(user.startCompanyDate || "")}
														/>
														<DialogFooter>
															<Button type="submit" className="bg-blue-500 hover:bg-blue-600">
																Salvar
															</Button>
															<Button
																type="button"
																className="bg-blue-500 hover:bg-blue-600"
																onClick={() => setIsEditing(false)}
															>
																Cancelar
															</Button>
														</DialogFooter>
													</form>
												)}
											</DialogContent>
										</Dialog>
									</div>
								</div>
								<div className="flex items-center justify-between pt-0 pb-4">
									<Pagination>
										<PaginationContent>
											<PaginationPrevious
												style={{ cursor: "pointer" }}
												onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
												className={`${currentPage === 1 ? "disabled" : ""}`}
											>
												Anterior
											</PaginationPrevious>

											{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
												<PaginationItem key={page}>
													<PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
														{page}
													</PaginationLink>
												</PaginationItem>
											))}

											<PaginationNext
												style={{ cursor: "pointer" }}
												onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
												className={`${currentPage === totalPages ? "disabled" : ""}`}
											>
												Próximo
											</PaginationNext>
										</PaginationContent>
									</Pagination>
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				)}
			</main>
		</Container>
	);
}
