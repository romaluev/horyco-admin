/**
 * Mock menu data for onboarding menu template step
 * This simulates the popular items API response
 */

export interface MockProduct {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  isSelected: boolean
  categoryId?: string
}

export interface MockCategory {
  id: string
  name: string
  products: MockProduct[]
  image?: string
  icon?: string
  color?: string
}

export const MOCK_POPULAR_MENU: MockCategory[] = [
  {
    id: 'cat-1',
    name: 'Горячие блюда',
    products: [
      {
        id: 'prod-1',
        name: 'Плов',
        price: 35000,
        description: 'Традиционный узбекский плов',
        isSelected: false,
      },
      {
        id: 'prod-2',
        name: 'Лагман',
        price: 28000,
        description: 'Суп-лапша с мясом и овощами',
        isSelected: false,
      },
      {
        id: 'prod-3',
        name: 'Шашлык из баранины',
        price: 45000,
        description: 'Нежный шашлык из баранины',
        isSelected: false,
      },
      {
        id: 'prod-4',
        name: 'Манты',
        price: 25000,
        description: 'Паровые манты с мясом',
        isSelected: false,
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Салаты',
    products: [
      {
        id: 'prod-5',
        name: 'Салат Ачик-чучук',
        price: 15000,
        description: 'Салат из помидоров и лука',
        isSelected: false,
      },
      {
        id: 'prod-6',
        name: 'Салат Цезарь',
        price: 22000,
        description: 'Классический салат с курицей',
        isSelected: false,
      },
      {
        id: 'prod-7',
        name: 'Греческий салат',
        price: 20000,
        description: 'Свежие овощи с сыром фета',
        isSelected: false,
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'Супы',
    products: [
      {
        id: 'prod-8',
        name: 'Шурпа',
        price: 18000,
        description: 'Традиционный узбекский суп',
        isSelected: false,
      },
      {
        id: 'prod-9',
        name: 'Мастава',
        price: 16000,
        description: 'Суп с рисом и мясом',
        isSelected: false,
      },
      {
        id: 'prod-10',
        name: 'Чучвара',
        price: 20000,
        description: 'Суп с пельменями',
        isSelected: false,
      },
    ],
  },
  {
    id: 'cat-4',
    name: 'Напитки',
    products: [
      {
        id: 'prod-11',
        name: 'Чай зеленый',
        price: 5000,
        description: 'Зеленый чай',
        isSelected: false,
      },
      {
        id: 'prod-12',
        name: 'Чай черный',
        price: 5000,
        description: 'Черный чай',
        isSelected: false,
      },
      {
        id: 'prod-13',
        name: 'Сок натуральный',
        price: 12000,
        description: 'Свежевыжатый сок',
        isSelected: false,
      },
      {
        id: 'prod-14',
        name: 'Лимонад',
        price: 10000,
        description: 'Домашний лимонад',
        isSelected: false,
      },
    ],
  },
  {
    id: 'cat-5',
    name: 'Десерты',
    products: [
      {
        id: 'prod-15',
        name: 'Наполеон',
        price: 18000,
        description: 'Торт Наполеон',
        isSelected: false,
      },
      {
        id: 'prod-16',
        name: 'Тирамису',
        price: 22000,
        description: 'Итальянский десерт',
        isSelected: false,
      },
      {
        id: 'prod-17',
        name: 'Чак-чак',
        price: 15000,
        description: 'Традиционный татарский десерт',
        isSelected: false,
      },
    ],
  },
]
