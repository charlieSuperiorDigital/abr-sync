import { Location, AVAILABLE_LOCATIONS } from "@/app/types/user"
import { CustomSelect } from "@/components/custom-components/selects/custom-select"

interface LocationSelectProps {
  selectedLocations: Location[]
  onLocationsChange?: (locations: Location[]) => void
}

export function LocationSelect({
  selectedLocations,
  onLocationsChange,
}: LocationSelectProps) {
  return (
    <CustomSelect
      multiSelect
      selectedValues={selectedLocations}
      value={selectedLocations}
      options={AVAILABLE_LOCATIONS.map(location => ({
        label: location,
        value: location
      }))}
      placeholder="Select locations..."
      onChange={(values) => {
        onLocationsChange?.(values as Location[])
      }}
    />
  )
}
