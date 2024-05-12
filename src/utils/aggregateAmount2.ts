const aggregateAmountsCurrentLiabilities = (data, key) => {
  const map = new Map()
  data.forEach(item => {
    const { id, details, amount1, amount2, isHeading } = item // Destructure item properties
    const detail = item[key]
    const amount = amount2 // Assuming you want to aggregate amount1
    if (map.has(detail)) {
      const existingData = map.get(detail)

      // Update the existing entry in the map with aggregated amount
      map.set(detail, {
        id: existingData.id,
        details: existingData.details,
        amount1: existingData.amount1,
        amount2: existingData.amount2 + amount,
        isHeading: existingData.isHeading
      })
    } else {
      // Add a new entry to the map
      map.set(detail, { id, details, amount1, amount2, isHeading })
    }
  })
  console.log('map', map.values())

  // Convert the map values to an array of objects
  return Array.from(map.values())
}

export default aggregateAmountsCurrentLiabilities
