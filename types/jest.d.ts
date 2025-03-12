import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveClass(className: string): R
      // Puedes agregar aquí otros matchers personalizados si los necesitas
    }
  }
}
