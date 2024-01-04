"use client";

import { IProduct } from "@/interfaces/IProduct";
import React, { useState } from "react";

import Table from "@/app/components/table.component";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast.component";
import { BsPlusLg } from "react-icons/bs";
import { LinkButton } from "@/app/components/buttons.component";

export default function Produtos() {
  const { products, isLoading, error, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();

  const router = useRouter();
  const { Toast, openToast } = useToast();

  function handleEdit(product: IProduct) {
    router.push(`/admin/configuracoes/produtos/${product.id}`);
  }

  function handleDelete(product: IProduct) {
    setSelectedProduct(product);
    openToast(
      `Você tem certeza que deseja excluir ${selectedProduct?.name}?`,
      () => handleDeleteProduct(),
      handleCancelDelete
    );
  }

  function handleDeleteProduct() {
    if (selectedProduct) deleteProduct(selectedProduct?.id);
  }

  function handleCancelDelete() {
    console.log("Deleted ", selectedProduct?.name);
  }

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
    );

  return (
    <div className="flex-1 items-center justify-center text-black">
      <Toast />
      <div className="flex justify-between items-center pb-2">
        <div className="text-lg font-medium">Produtos</div>
        <div>
          <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full"
            href={"/admin/configuracoes/produtos/cadastro"}
          >
            <BsPlusLg className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo Produto</span>
          </LinkButton>
        </div>
      </div>
      {products && (
        <Table
          items={products}
          headers={{
            keys: ["name", "smallDescription"],
            headers: ["Nome", "Descrição", "Ações"],
          }}
          actions={["edit", "delete"]}
          handleEdit={(item) => handleEdit(item)}
          handleDelete={(item) => handleDelete(item)}
        />
      )}
    </div>
  );
}
