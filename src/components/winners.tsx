import Image from "next/image";
import { useState, useEffect } from "react";

// Dados dos produtos disponíveis
const products = [
    {
        id: 1,
        product: "Celular NK 109",
        price: "R$ 2.800,00",
        image: "/item_c2_nk109.png"
    },
    {
        id: 2,
        product: "Air Fryer",
        price: "R$ 850,00",
        image: "/item_air_fryer.png"
    },
    {
        id: 3,
        product: "50 Reais",
        price: "R$ 50,00",
        image: "/50_money.webp"
    },
    {
        id: 4,
        product: "Bolsa Dior",
        price: "R$ 11.500,00",
        image: "/1752261038.webp"
    },
    {
        id: 5,
        product: "200 Reais",
        price: "R$ 200,00",
        image: "/200_money.webp"
    },
    {
        id: 6,
        product: "iPhone 12",
        price: "R$ 3.000,00",
        image: "/item_iphone_12.png"
    },
    {
        id: 7,
        product: "Apple Watch",
        price: "R$ 3.200,00",
        image: "/apple_watch.webp"
    },
    {
        id: 8,
        product: "100 Reais",
        price: "R$ 100,00",
        image: "/100_money.webp"
    },
    {
        id: 10,
        product: "Shopee Gift Card",
        price: "R$ 500,00",
        image: "/1752261024.webp"
    }
];

        // Função para obter cor baseada na variável de ambiente
  const getAppColor = () => {
    const color = process.env.NEXT_PUBLIC_APP_COLOR
    switch (color) {
      case 'yellow':
        return 'bg-yellow-600'
      case 'blue':
        return 'bg-blue-600'
      case 'green':
        return 'bg-green-600'
      case 'red':
        return 'bg-red-600'
      case 'purple':
        return 'bg-purple-600'
      case 'pink':
        return 'bg-pink-600'
      case 'indigo':
        return 'bg-indigo-600'
      case 'gray':
        return 'bg-gray-600'
      default:
        return 'bg-yellow-600'
    }
  }

  const getAppColorSvg = () => {
    const color = process.env.NEXT_PUBLIC_APP_COLOR
    switch (color) {
      case 'yellow':
        return '#fcb00a'
      case 'blue':
        return '#007bff'
      case 'green':
        return '#28a745'
      case 'red':
        return '#dc3545'
      case 'purple':
        return '#6f42c1'
      case 'pink':
        return '#e83e8c'
      case 'indigo':
        return '#6610f2'
      case 'gray':
        return '#6c757d'
      default:
        return '#fcb00a'
    }
  }

  const getAppColorText = () => {
    const color = process.env.NEXT_PUBLIC_APP_COLOR
    switch (color) {
      case 'yellow':
        return 'text-yellow-600'
      case 'blue':
        return 'text-blue-600'
      case 'green':
        return 'text-green-600'
      case 'red':
        return 'text-red-600'
      case 'purple':
        return 'text-purple-600'
      case 'pink':
        return 'text-pink-600'
      case 'indigo':
        return 'text-indigo-600'
      case 'gray':
        return 'text-gray-600'
      default:
        return 'text-yellow-600'
    }
  }

// Nomes brasileiros para gerar ganhadores aleatórios
const firstNames = [
    "Ana", "João", "Maria", "Pedro", "Lucas", "Julia", "Gabriel", "Sofia", "Matheus", "Isabella",
    "Rafael", "Lara", "Gustavo", "Beatriz", "Bruno", "Camila", "Leonardo", "Amanda", "Thiago", "Mariana",
    "Felipe", "Carolina", "Diego", "Fernanda", "André", "Bianca", "Carlos", "Letícia", "Ricardo", "Vanessa",
    "Eduardo", "Priscila", "Roberto", "Tatiana", "Fernando", "Aline", "Rodrigo", "Claudia", "Marcelo", "Renata",
    "Alexandre", "Patricia", "Daniel", "Monica", "Paulo", "Cristina", "Marcos", "Adriana", "Luis", "Elaine"
];

const lastNames = [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Pereira", "Lima", "Gomes",
    "Costa", "Ribeiro", "Martins", "Carvalho", "Alves", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa",
    "Rocha", "Dias", "Nascimento", "Araújo", "Cavalcanti", "Correia", "Cardoso", "Melo", "Castro", "Dantas",
    "Freitas", "Cunha", "Moreira", "Azevedo", "Barros", "Campos", "Mendes", "Farias", "Teixeira", "Monteiro"
];

// Função para gerar nome aleatório (primeiro nome + ***)
const generateRandomName = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    return `${firstName}***`;
};

// Função para gerar ganhador aleatório sem repetir nomes
const generateRandomWinner = (existingNames: string[] = []) => {
    const product = products[Math.floor(Math.random() * products.length)];
    
    // Gerar nome que não está sendo usado
    let name;
    let attempts = 0;
    do {
        name = generateRandomName();
        attempts++;
        // Evitar loop infinito se todos os nomes estiverem em uso
        if (attempts > 50) {
            name = `Usuário${Math.floor(Math.random() * 1000)}`;
            break;
        }
    } while (existingNames.includes(name));
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        product: product.product,
        price: product.price,
        image: product.image
    };
};

export default function Winners() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [winners, setWinners] = useState<Array<{
        id: string;
        name: string;
        product: string;
        price: string;
        image: string;
    }>>([]);
    const [isClient, setIsClient] = useState(false);

    // Garantir que o componente só renderize no cliente
    useEffect(() => {
        setIsClient(true);
        // Gerar 10 ganhadores iniciais apenas no cliente
        const initialWinners: Array<{
            id: string;
            name: string;
            product: string;
            price: string;
            image: string;
        }> = [];
        for (let i = 0; i < 10; i++) {
            const existingNames = initialWinners.map(w => w.name);
            initialWinners.push(generateRandomWinner(existingNames));
        }
        setWinners(initialWinners);
    }, []);

    // Auto-scroll infinito do carrossel
    useEffect(() => {
        const interval = setInterval(() => {
            setScrollPosition((prev) => {
                const newPosition = prev + 1;
                // Reset quando chegar ao final
                if (newPosition >= winners.length * 200) {
                    return 0;
                }
                return newPosition;
            });
        }, 50); // Velocidade mais rápida para movimento suave

        return () => clearInterval(interval);
    }, [winners.length]);

    // Atualizar ganhadores periodicamente
    useEffect(() => {
        const interval = setInterval(() => {
            setWinners(prevWinners => {
                // Remover o primeiro ganhador e adicionar um novo no final
                const existingNames = prevWinners.map(w => w.name);
                const newWinner = generateRandomWinner(existingNames);
                const newWinners = [...prevWinners.slice(1), newWinner];
                return newWinners;
            });
        }, 4000); // Atualizar a cada 4 segundos

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4 overflow-hidden">
            {/* SVG do troféu */}
            <div className="flex-shrink-0">
                <svg viewBox="0 0 59 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-15 sm:h-15">
                    <path d="M2.381 31.8854L0.250732 32.1093L5.76436 16.3468L8.04082 16.1075L13.5753 30.7088L11.4242 30.9349L10.0667 27.2976L3.71764 27.9649L2.381 31.8854ZM6.64153 19.5306L4.34418 26.114L9.461 25.5762L7.14277 19.4779C7.101 19.3283 7.05227 19.1794 6.99657 19.0313C6.94088 18.8691 6.90607 18.7328 6.89215 18.6222C6.8643 18.7372 6.82949 18.8808 6.78772 19.0532C6.74595 19.2116 6.69722 19.3707 6.64153 19.5306Z" fill="#7B869D"></path>
                    <path d="M28.5469 21.5332C28.5469 23.0732 28.2336 24.4711 27.6071 25.727C26.9945 26.9674 26.1382 27.9814 25.0382 28.769C23.9522 29.5411 22.6922 30.0026 21.2581 30.1533C19.8518 30.3011 18.5987 30.1038 17.4988 29.5614C16.4128 29.0036 15.5634 28.1688 14.9508 27.0572C14.3382 25.9456 14.0319 24.6128 14.0319 23.0588C14.0319 21.5188 14.3382 20.1286 14.9508 18.8882C15.5774 17.6464 16.4336 16.6324 17.5197 15.8462C18.6057 15.0601 19.8588 14.5924 21.2789 14.4431C22.7131 14.2924 23.9731 14.4959 25.0591 15.0538C26.1451 15.6117 26.9945 16.4464 27.6071 17.558C28.2336 18.6681 28.5469 19.9932 28.5469 21.5332ZM26.3958 21.7593C26.3958 20.5833 26.18 19.577 25.7483 18.7404C25.3306 17.9023 24.7389 17.2855 23.9731 16.8899C23.2073 16.4804 22.3093 16.3298 21.2789 16.4381C20.2625 16.5449 19.3715 16.8836 18.6057 17.4541C17.8399 18.0106 17.2412 18.7525 16.8096 19.6799C16.3919 20.6058 16.183 21.6567 16.183 22.8327C16.183 24.0087 16.3919 25.0158 16.8096 25.8539C17.2412 26.6905 17.8399 27.3136 18.6057 27.7231C19.3715 28.1326 20.2625 28.2839 21.2789 28.1771C22.3093 28.0688 23.2073 27.7294 23.9731 27.1589C24.7389 26.5745 25.3306 25.8193 25.7483 24.8934C26.18 23.966 26.3958 22.9213 26.3958 21.7593Z" fill="#7B869D"></path>
                    <path d="M5.74539 52.1851L0.200195 37.8724L3.66344 37.5084L6.46607 44.7421C6.63956 45.1801 6.79971 45.6397 6.94652 46.1208C7.09332 46.6018 7.2468 47.156 7.40695 47.7833C7.59379 47.0525 7.76061 46.4445 7.90742 45.9594C8.06757 45.4729 8.22772 44.9998 8.38787 44.5401L11.1505 36.7215L14.5336 36.3659L9.08853 51.8337L5.74539 52.1851Z" fill={`${getAppColorSvg()}`}></path>
                    <path d="M19.3247 35.8623V50.7578L16.0816 51.0987V36.2032L19.3247 35.8623Z" fill={`${getAppColorSvg()}`}></path>
                    <path d="M26.4195 50.0121L20.8743 35.6995L24.3375 35.3355L27.1401 42.5692C27.3136 43.0072 27.4738 43.4667 27.6206 43.9478C27.7674 44.4289 27.9209 44.9831 28.081 45.6104C28.2679 44.8795 28.4347 44.2716 28.5815 43.7864C28.7416 43.2999 28.9018 42.8268 29.0619 42.3672L31.8245 34.5486L35.2077 34.193L29.7626 49.6608L26.4195 50.0121Z" fill={`${getAppColorSvg()}`}></path>
                    <path d="M49.647 40.1029C49.647 41.6193 49.3401 42.9935 48.7261 44.2255C48.1122 45.4441 47.2581 46.4397 46.1637 47.2123C45.0694 47.9714 43.8015 48.4268 42.3602 48.5782C40.9322 48.7283 39.671 48.5388 38.5766 48.0097C37.4956 47.4658 36.6482 46.6491 36.0343 45.5595C35.4337 44.4686 35.1334 43.1649 35.1334 41.6485C35.1334 40.1321 35.4404 38.7646 36.0543 37.5461C36.6682 36.314 37.5156 35.3192 38.5967 34.5614C39.691 33.7889 40.9522 33.3275 42.3802 33.1774C43.8216 33.0259 45.0827 33.2222 46.1637 33.7661C47.2581 34.2952 48.1122 35.1045 48.7261 36.1941C49.3401 37.2836 49.647 38.5866 49.647 40.1029ZM46.2238 40.4627C46.2238 39.51 46.0703 38.7142 45.7634 38.0755C45.4564 37.4234 45.016 36.9463 44.4421 36.6443C43.8816 36.3409 43.201 36.2313 42.4002 36.3155C41.5995 36.3996 40.9122 36.653 40.3383 37.0757C39.7644 37.4983 39.324 38.0679 39.017 38.7846C38.7101 39.4878 38.5566 40.3158 38.5566 41.2686C38.5566 42.2214 38.7101 43.0238 39.017 43.6759C39.324 44.3281 39.7644 44.8051 40.3383 45.1071C40.9122 45.4091 41.5995 45.5181 42.4002 45.4339C43.201 45.3497 43.8816 45.097 44.4421 44.6758C45.016 44.2398 45.4564 43.6634 45.7634 42.9467C46.0703 42.2301 46.2238 41.4021 46.2238 40.4627Z" fill={`${getAppColorSvg()}`}></path>
                    <circle cx="39" cy="20" r="6" fill="#222733"></circle>
                    <g filter="url(#filter0_d_726_17235)"><circle cx="39" cy="20" r="3.75" fill={`${getAppColorSvg()}`}></circle></g>
                </svg>
            </div>

            {/* Carrossel de ganhadores */}
            <div className="relative flex-1 overflow-hidden">

                {/* Container do carrossel */}
                <div className="flex gap-3 overflow-hidden">
                    {/* Duplicar os cards para criar efeito infinito */}
                    {[...winners, ...winners].map((winner, index) => (
                        <div
                            key={`${winner.id}-${index}`}
                            className="flex-shrink-0 w-48 bg-neutral-800/50 border border-neutral-700 rounded-lg p-3"
                            style={{
                                transform: `translateX(-${scrollPosition}px)`,
                                transition: 'transform 0.05s linear'
                            }}
                        >
                            {/* Layout horizontal: imagem à esquerda, texto à direita */}
                            <div className="flex items-center gap-3">
                                {/* Imagem do produto */}
                                <div className="relative w-16 h-16  rounded overflow-hidden flex-shrink-0">
                                    <Image
                                        src={winner.image}
                                        alt={winner.product}
                                        fill
                                        className="object-scale-down"
                                    />
                                </div>

                                {/* Informações do ganhador */}
                                <div className="flex-1 min-w-0">
                                    <p className={`${getAppColorText()} text-sm font-medium truncate`}>
                                        {winner.name}
                                    </p>
                                    <p className="text-neutral-400 text-xs truncate mt-1">
                                        {winner.product}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-green-500 text-xs font-bold">R$</span>
                                        <span className="text-green-500 text-sm font-bold">
                                            {winner.price.replace('R$ ', '')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gradiente de fade nas bordas */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-900 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
}