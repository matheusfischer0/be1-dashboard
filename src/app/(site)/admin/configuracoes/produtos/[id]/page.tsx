"use client";

import React, { useCallback, useEffect } from "react";
import { z, ZodType } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/inputs.component";
import { Button } from "@/app/components/buttons.component";
import { useFile } from "@/hooks/useFile";
import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";

interface EditPageProps {
  params: { id: string };
}

// Define the zod schema
const productSchema = z.object({
  name: z.string().nonempty("O nome não pode ser vazio!"),
  smallDescription: z
    .string()
    .nonempty("A descrição curta é obrigatória")
    .max(100, "Máximo de 100 caracteres"),
  description: z.string().nonempty("Uma descrição deve ser adicionada!"),
  images: z.any().optional() as ZodType<FileList | null>,
  files: z.any().optional() as ZodType<FileList | null>,
});

type EditProductFormData = z.infer<typeof productSchema>;

export default function EditPage({ params }: EditPageProps) {
  const { product, updateProduct, refetchProduct, isLoading, error } =
    useProduct(params.id);

  const { files, uploadFiles, deleteFile, setInitialFiles } = useFile({
    productId: product?.id,
    fileType: "DOCUMENT",
  });

  const {
    files: images,
    uploadFiles: uploadImages,
    deleteFile: deleteImage,
    setInitialFiles: setInitialImages,
  } = useFile({
    productId: product?.id,
    fileType: "IMAGE",
  });

  const router = useRouter();

  const methods = useForm<EditProductFormData>({
    resolver: zodResolver(productSchema),
    reValidateMode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methods;

  // WATCH IMAGES TO BE UPLOADED
  const selectedImages = watch("images");
  const handleUploadImages = useCallback(
    async (imagesToUpload: FileList) => {
      await uploadImages(imagesToUpload);
      setValue("images", null);
    },
    [uploadImages]
  );

  useEffect(() => {
    if (selectedImages) {
      handleUploadImages(selectedImages);
    }
  }, [selectedImages]);

  // WATCH FILES TO BE UPLOADED
  const selectedFiles = watch("files");
  const handleUploadFiles = useCallback(
    async (filesToUpload: FileList) => {
      await uploadFiles(filesToUpload);
      setValue("files", null);
    },
    [uploadFiles]
  );

  useEffect(() => {
    if (selectedFiles) {
      handleUploadFiles(selectedFiles);
    }
  }, [selectedFiles]);

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("smallDescription", product.smallDescription);
      setValue("description", product.description ? product.description : "");
      setValue("images", null);
      setValue("files", null);

      if (product.images) setInitialImages(product.images);

      if (product.files) setInitialFiles(product.files);
    }
  }, [product]);

  if (error) return <div>An error has occurred: {error.message}</div>;

  const onSubmit = (data: EditProductFormData) => {
    if (data.name) {
      updateProduct({
        id: params.id,
        name: data.name,
        smallDescription: data.smallDescription,
        description: data.description,
        images,
      });
    }
    router.push("/admin/configuracoes/produtos");
  };

  const handleDeleteImage = (id: string) => {
    deleteImage(id);
  };
  const handleDeleteFile = (id: string) => {
    deleteFile(id);
  };

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Produto</div>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex">
            <div className="flex flex-wrap gap-3">
              <Input.Root className="w-full md:flex-1">
                <Input.Label>Nome</Input.Label>
                <Input.Controller register={register("name")} type="text" />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full md:flex-1">
                <Input.Label>Descrição Curta</Input.Label>
                <Input.Controller
                  register={register("smallDescription")}
                  type="text"
                />
                <Input.Error>
                  {errors.smallDescription && (
                    <p>{errors.smallDescription.message?.toString()}</p>
                  )}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full">
                <Input.Label>Descrição</Input.Label>
                <Input.TextAreaController register={register("description")} />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>

              <Input.Root className="w-full lg:flex-1">
                <Input.Label>Fotos do produto</Input.Label>
                <Input.FileController name="images" accept="image/*" multiple />
                <Input.Error>
                  {errors.images && <p>{errors.images.message?.toString()}</p>}
                </Input.Error>
                {images && (
                  <Input.ImagesPreview
                    files={images}
                    onDelete={(id) => handleDeleteImage(id)}
                  />
                )}
              </Input.Root>
              <Input.Root className="w-full lg:flex-1">
                <Input.Label>
                  Arquivos (Visível para produtores e técnicos)
                </Input.Label>
                <Input.FileController name="files" accept=".pdf" multiple />
                <Input.Error>
                  {errors.files && <p>{errors.files.message?.toString()}</p>}
                </Input.Error>
                {files && (
                  <Input.FilesPreview
                    files={files}
                    onDelete={(id) => handleDeleteFile(id)}
                  />
                )}
              </Input.Root>
            </div>
          </div>

          <div className="py-4">
            <Button
              className={`bg-gradient-to-r from-blue-600 to-blue-400 rounded-md px-4 text-white w-36 justify-center`}
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
