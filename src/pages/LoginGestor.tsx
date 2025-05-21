import React, { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { userSchema } from "../lib/schemaLoginUser";
import { Loader } from "lucide-react";
import useNavigateTo from "../hooks/useNavigateTo";
import HeaderBasic from "../components/navigation/HeaderBasic";

import { useHookFormMask } from "use-mask-input";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const LoginGestor: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const GoTo = useNavigateTo();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const registerWithMask = useHookFormMask(register);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      GoTo("/home-gestor");
      localStorage.setItem("token", token);
      localStorage.setItem("manager", "true");

    }
  }, [GoTo]);

  async function onSubmit(data: FieldValues) {
    try {
      const { email, password } = data;


      // Verificação: log para garantir que o campo type está correto
      console.log("Tentando login gestor:", {
        email,
        password,
        type: "manager",
      });

      // Certifique-se de que está chamando login({ email, password, type: "manager" })
      await login({ email, password, type: "manager" } as any);


      GoTo("/home-gestor");
    } catch (error: any) {
      console.error("Erro no login:", error);

      // Log extra para depuração do erro
      if (error.response) {
        console.error("Erro response:", error.response);
      }

      toast.error(error.message || "Erro ao fazer login", {
        duration: 3000,
        position: "top-center",
      });
    }
  }


  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-[#F4F6FF] flex flex-col pb-16">
        <h1 className="absolute top-7 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 text-2xl mb-10 font-jockey text-black">
          ESPORTE NA CIDADE
        </h1>
        <main className="flex flex-col items-center flex-1">
          <div className="flex flex-col py-32 m-4 md:mx-20 p-4 md:px-24 w-full max-w-5xl">
            <div className="text-start px-8 mb-8">
              <h2 className="text-4xl font-bold pb-2">
                Olá, <span className="text-orange-600">Gestor!</span>
              </h2>
              <p className="font-inter">Entre em sua conta para começar.</p>
            </div>
            <form
              className="bg- p-8 rounded-lg w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <section className="mb-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="mb4">
                    <label
                      htmlFor="email"
                      className="block text-sm pb-2 font-medium text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Preencha com seu Email"
                      {...register("email")}
                      className="w-full pl-10 pr-3 bg-[#D9D9D9] opacity-70 placeholder-black h-12 p-3 border border-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-orange-600 focus:ring-opacity-40"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.email?.message as string}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm pb-2 font-medium text-gray-600"
                    >
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        placeholder="Preencha com sua senha"
                        {...register("password")}
                        className="w-full pl-10 pr-10 bg-[#D9D9D9] opacity-70 placeholder-black h-12 p-3 border border-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-orange-600 focus:ring-opacity-40"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-3 text-gray-600"
                      >
                        {isPasswordVisible ? (
                          <EyeIcon size={20} />
                        ) : (
                          <EyeOffIcon size={20} />
                        )}
                      </button>
                      {errors.password && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.password?.message as string}
                        </p>
                      )}
                    </div>
                    <a href="#" className="text-blue-600 mt-2 block">
                      Esqueci minha senha
                    </a>
                  </div>
                </div>
              </section>

              <div className="py-10 flex justify-end gap-7">
                <button
                  type="button"
                  onClick={() => GoTo("/")}
                  className="h-13 md:w-52 font-bold font-inter bg-gray-200 text-gray-700 py-3 px-9 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-13 md:w-52 font-bold font-inter bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="w-full text-center mt-auto">
          <p className="text-sm text-gray-500">
            2024 Esporte na cidade. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

