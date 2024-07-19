import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Menu from "@/components/menu";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={inter.className}>
				<div className="flex min-h-screen relative">
					<Menu />
					<main className="px-2 sm:py-4 sm:px-6 md:py-8 md:px-12 bg-[#ececff] w-screen">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
