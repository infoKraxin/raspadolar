/**
 * Utilitário para obter cores baseadas na variável de ambiente NEXT_PUBLIC_APP_COLOR
 * Centraliza a lógica de cores para reutilização em todo o projeto
 */

export const getAppColor = () => {
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

export const getAppColorSvg = () => {
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

export const getAppColorText = () => {
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

export const getAppColorBorder = () => {
  const color = process.env.NEXT_PUBLIC_APP_COLOR
  switch (color) {
    case 'yellow':
      return 'border-yellow-600'
    case 'blue':
      return 'border-blue-600'
    case 'green':
      return 'border-green-600'
    case 'red':
      return 'border-red-600'
    case 'purple':
      return 'border-purple-600'
    case 'pink':
      return 'border-pink-600'
    case 'indigo':
      return 'border-indigo-600'
    case 'gray':
      return 'border-gray-600'
    default:
      return 'border-yellow-600'
  }
}

export const getAppColorRing = () => {
  const color = process.env.NEXT_PUBLIC_APP_COLOR
  switch (color) {
    case 'yellow':
      return 'ring-yellow-500'
    case 'blue':
      return 'ring-blue-500'
    case 'green':
      return 'ring-green-500'
    case 'red':
      return 'ring-red-500'
    case 'purple':
      return 'ring-purple-500'
    case 'pink':
      return 'ring-pink-500'
    case 'indigo':
      return 'ring-indigo-500'
    case 'gray':
      return 'ring-gray-500'
    default:
      return 'ring-yellow-500'
  }
}

export const getAppGradient = () => {
  const color = process.env.NEXT_PUBLIC_APP_COLOR
  switch (color) {
    case 'yellow':
      return 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
    case 'blue':
      return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
    case 'green':
      return 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
    case 'red':
      return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
    case 'purple':
      return 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
    case 'pink':
      return 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800'
    case 'indigo':
      return 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
    case 'gray':
      return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
    default:
      return 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
  }
}

export const getAppColorHover = () => {
  const color = process.env.NEXT_PUBLIC_APP_COLOR
  switch (color) {
    case 'yellow':
      return 'hover:bg-yellow-700'
    case 'blue':
      return 'hover:bg-blue-700'
    case 'green':
      return 'hover:bg-green-700'
    case 'red':
      return 'hover:bg-red-700'
    case 'purple':
      return 'hover:bg-purple-700'
    case 'pink':
      return 'hover:bg-pink-700'
    case 'indigo':
      return 'hover:bg-indigo-700'
    case 'gray':
      return 'hover:bg-gray-700'
    default:
      return 'hover:bg-yellow-700'
  }
}

export const getAppColorLight = () => {
  const color = process.env.NEXT_PUBLIC_APP_COLOR
  switch (color) {
    case 'yellow':
      return 'bg-yellow-500'
    case 'blue':
      return 'bg-blue-500'
    case 'green':
      return 'bg-green-500'
    case 'red':
      return 'bg-red-500'
    case 'purple':
      return 'bg-purple-500'
    case 'pink':
      return 'bg-pink-500'
    case 'indigo':
      return 'bg-indigo-500'
    case 'gray':
      return 'bg-gray-500'
    default:
      return 'bg-yellow-500'
  }
}

export const getAppColorDark = () => {
  const color = process.env.NEXT_PUBLIC_APP_COLOR
  switch (color) {
    case 'yellow':
      return 'bg-yellow-700'
    case 'blue':
      return 'bg-blue-700'
    case 'green':
      return 'bg-green-700'
    case 'red':
      return 'bg-red-700'
    case 'purple':
      return 'bg-purple-700'
    case 'pink':
      return 'bg-pink-700'
    case 'indigo':
      return 'bg-indigo-700'
    case 'gray':
      return 'bg-gray-700'
    default:
      return 'bg-yellow-700'
  }
}

// Função para obter todas as classes de cor de uma vez
export const getAppColorClasses = () => {
  return {
    bg: getAppColor(),
    text: getAppColorText(),
    border: getAppColorBorder(),
    ring: getAppColorRing(),
    gradient: getAppGradient(),
    hover: getAppColorHover(),
    light: getAppColorLight(),
    dark: getAppColorDark(),
    svg: getAppColorSvg()
  }
} 