import useNavigateTo from "../../hooks/useNavigateTo";

const HeaderBasic = () => {
    const GoTo = useNavigateTo();


    return (
        <header className="w-full bg-white flex items-center justify-between px-6 py-4 mb-10 shadow md:flex">
        <div className="flex items-center space-x-4">
            <img
                src="https://lh3.googleusercontent.com/proxy/X-B99B9HsP3Lo4ae0nDQMozyMHTcxxdcPINH959IZlOUhqK7j0tdAK-sz09ISiS2c0ew2N4wyhXsHyR5EZ1vqwJKbh0VhZBj7gEfvT4DeFZkKw"
                alt="Logo"
                className="h-10"
            />
            <h1
              className="text-xl font-jockey"
              onClick={() => GoTo("/")}
              style={{ cursor: "pointer" }}
            >
              ESPORTE NA CIDADE
            </h1>
        </div>
    </header>
    );
  };
  export default HeaderBasic;