import 'jspdf'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: (string | number)[][]
      body?: (string | number)[][]
      startY?: number
      styles?: {
        fontSize?: number
        cellPadding?: number
        overflow?: string
        halign?: 'left' | 'center' | 'right'
        valign?: 'top' | 'middle' | 'bottom'
      }
      headStyles?: {
        fillColor?: number | number[]
        textColor?: number | number[]
        fontStyle?: string
      }
      alternateRowStyles?: {
        fillColor?: number | number[]
      }
      columnStyles?: Record<number, {
        cellWidth?: number | 'auto' | 'wrap'
        halign?: 'left' | 'center' | 'right'
      }>
      margin?: { top?: number; right?: number; bottom?: number; left?: number }
      didDrawPage?: (data: { pageNumber: number }) => void
      theme?: 'striped' | 'grid' | 'plain'
    }) => jsPDF
    lastAutoTable?: {
      finalY: number
    }
  }
}
