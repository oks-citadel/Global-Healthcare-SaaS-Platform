'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Navigation, MapPin } from 'lucide-react'
import { KioskLayout } from '@/components/KioskLayout'
import { useLanguage } from '@/components/LanguageProvider'

const locations = [
  { id: 1, name: 'Emergency Room', floor: '1st Floor', directions: 'Follow red line. Turn right at main lobby.' },
  { id: 2, name: 'Radiology', floor: 'Ground Floor', directions: 'Follow blue line. Located in Building B.' },
  { id: 3, name: 'Laboratory', floor: '2nd Floor', directions: 'Take elevator to 2nd floor, turn left.' },
  { id: 4, name: 'Cardiology', floor: '3rd Floor', directions: 'Take elevator to 3rd floor, follow yellow line.' },
  { id: 5, name: 'Pharmacy', floor: '1st Floor', directions: 'Follow green line. Next to main entrance.' },
  { id: 6, name: 'Cafeteria', floor: 'Ground Floor', directions: 'Follow orange line. Turn left at main lobby.' },
  { id: 7, name: 'Chapel', floor: '2nd Floor', directions: 'Take elevator to 2nd floor, turn right.' },
  { id: 8, name: 'Gift Shop', floor: '1st Floor', directions: 'Near main entrance, next to information desk.' },
]

export default function DirectionsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <KioskLayout
      title={t('directions.title')}
      onBack={() => router.push('/')}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {!selectedLocation ? (
              <div className="card-kiosk animate-fadeIn">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('directions.selectDestination')}
                </h2>

                <div className="mb-6">
                  <input
                    type="text"
                    className="input-touch w-full"
                    placeholder={t('directions.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location)}
                      className="btn-touch-lg btn-secondary text-left flex items-start gap-4"
                    >
                      <MapPin className="w-8 h-8 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-bold text-kiosk-lg">
                          {location.name}
                        </div>
                        <div className="text-kiosk-sm text-gray-600 mt-1">
                          {location.floor}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredLocations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-kiosk-lg text-gray-500">
                      {t('directions.noResults')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="card-kiosk">
                  <div className="flex items-center gap-4 mb-6">
                    <Navigation className="w-12 h-12 text-primary-600" />
                    <div>
                      <h2 className="text-kiosk-2xl font-bold">
                        {selectedLocation.name}
                      </h2>
                      <p className="text-kiosk-lg text-gray-600">
                        {selectedLocation.floor}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-6">
                    <h3 className="text-kiosk-lg font-bold mb-4 text-blue-900">
                      {t('directions.howToGetThere')}
                    </h3>
                    <p className="text-kiosk-base text-blue-800 leading-relaxed">
                      {selectedLocation.directions}
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-24 h-24 mx-auto mb-4" />
                      <p className="text-kiosk-base">
                        {t('directions.mapPlaceholder')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="btn-touch btn-secondary w-full mt-6"
                  >
                    {t('directions.backToList')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t-2 border-gray-200 p-6">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => selectedLocation ? setSelectedLocation(null) : router.push('/')}
              className="btn-touch btn-secondary flex-1"
            >
              <ArrowLeft className="w-6 h-6 mr-2 inline" />
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
