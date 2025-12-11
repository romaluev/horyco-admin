/**
 * Uzbekistan Cities and Regions (Districts) Data
 * Static data for location selection in onboarding
 */

export interface UzbekistanRegion {
  id: string
  name: string
  nameEn: string
}

export interface UzbekistanCity {
  id: string
  name: string
  nameEn: string
  regions: UzbekistanRegion[]
}

export const UZBEKISTAN_CITIES: UzbekistanCity[] = [
  {
    id: 'tashkent',
    name: 'Ташкент',
    nameEn: 'Tashkent',
    regions: [
      { id: 'yunusabad', name: 'Юнусабадский район', nameEn: 'Yunusabad' },
      { id: 'chilanzar', name: 'Чиланзарский район', nameEn: 'Chilanzar' },
      { id: 'yakkasaray', name: 'Яккасарайский район', nameEn: 'Yakkasaray' },
      {
        id: 'mirzo-ulugbek',
        name: 'Мирзо-Улугбекский район',
        nameEn: 'Mirzo-Ulugbek',
      },
      { id: 'mirobod', name: 'Мирабадский район', nameEn: 'Mirobod' },
      {
        id: 'shaykhontohur',
        name: 'Шайхонтохурский район',
        nameEn: 'Shaykhontohur',
      },
      { id: 'almazar', name: 'Алмазарский район', nameEn: 'Almazar' },
      { id: 'bektemir', name: 'Бектемирский район', nameEn: 'Bektemir' },
      { id: 'uchtepa', name: 'Учтепинский район', nameEn: 'Uchtepa' },
      { id: 'sergeli', name: 'Сергелийский район', nameEn: 'Sergeli' },
      { id: 'yashnabad', name: 'Яшнабадский район', nameEn: 'Yashnabad' },
    ],
  },
  {
    id: 'samarkand',
    name: 'Самарканд',
    nameEn: 'Samarkand',
    regions: [
      { id: 'samarkand-center', name: 'Центральный район', nameEn: 'Center' },
      { id: 'samarkand-north', name: 'Северный район', nameEn: 'North' },
      { id: 'samarkand-south', name: 'Южный район', nameEn: 'South' },
    ],
  },
  {
    id: 'bukhara',
    name: 'Бухара',
    nameEn: 'Bukhara',
    regions: [
      { id: 'bukhara-center', name: 'Центральный район', nameEn: 'Center' },
      { id: 'bukhara-old-city', name: 'Старый город', nameEn: 'Old City' },
    ],
  },
  {
    id: 'andijan',
    name: 'Андижан',
    nameEn: 'Andijan',
    regions: [
      { id: 'andijan-center', name: 'Центральный район', nameEn: 'Center' },
      { id: 'andijan-east', name: 'Восточный район', nameEn: 'East' },
    ],
  },
  {
    id: 'fergana',
    name: 'Фергана',
    nameEn: 'Fergana',
    regions: [
      { id: 'fergana-center', name: 'Центральный район', nameEn: 'Center' },
      { id: 'fergana-south', name: 'Южный район', nameEn: 'South' },
    ],
  },
  {
    id: 'namangan',
    name: 'Наманган',
    nameEn: 'Namangan',
    regions: [
      { id: 'namangan-center', name: 'Центральный район', nameEn: 'Center' },
      { id: 'namangan-north', name: 'Северный район', nameEn: 'North' },
    ],
  },
  {
    id: 'karshi',
    name: 'Карши',
    nameEn: 'Karshi',
    regions: [
      { id: 'karshi-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
  {
    id: 'termez',
    name: 'Термез',
    nameEn: 'Termez',
    regions: [
      { id: 'termez-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
  {
    id: 'urgench',
    name: 'Ургенч',
    nameEn: 'Urgench',
    regions: [
      { id: 'urgench-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
  {
    id: 'nukus',
    name: 'Нукус',
    nameEn: 'Nukus',
    regions: [
      { id: 'nukus-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
  {
    id: 'navoiy',
    name: 'Навои',
    nameEn: 'Navoiy',
    regions: [
      { id: 'navoiy-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
  {
    id: 'jizzakh',
    name: 'Джизак',
    nameEn: 'Jizzakh',
    regions: [
      { id: 'jizzakh-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
  {
    id: 'gulistan',
    name: 'Гулистан',
    nameEn: 'Gulistan',
    regions: [
      { id: 'gulistan-center', name: 'Центральный район', nameEn: 'Center' },
    ],
  },
]

/**
 * Get regions by city ID
 */
export const getRegionsByCity = (cityId: string): UzbekistanRegion[] => {
  const city = UZBEKISTAN_CITIES.find((c) => c.id === cityId)
  return city?.regions || []
}

/**
 * Get city by ID
 */
export const getCityById = (cityId: string): UzbekistanCity | undefined => {
  return UZBEKISTAN_CITIES.find((c) => c.id === cityId)
}
