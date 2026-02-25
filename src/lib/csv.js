import Papa from 'papaparse'

export function parseItemsCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors)
        } else {
          resolve(results.data)
        }
      },
      error: (err) => reject(err),
    })
  })
}

export function validateItems(items) {
  const errors = []
  items.forEach((item, i) => {
    const row = i + 2
    if (!item.itemNumber) errors.push(`Row ${row}: missing itemNumber`)
    if (!item.title) errors.push(`Row ${row}: missing title`)
    if (item.minimumBid != null && isNaN(item.minimumBid))
      errors.push(`Row ${row}: minimumBid must be a number`)
    if (item.estimatedValue != null && isNaN(item.estimatedValue))
      errors.push(`Row ${row}: estimatedValue must be a number`)
  })
  return errors
}
