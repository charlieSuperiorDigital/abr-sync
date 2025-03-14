import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserImageAndName from '../user-image-and-name'

describe('UserImageAndName', () => {
    const mockProps = {
        image: 'https://picsum.photos/200',
        name: 'John Doe'
    }

    it('renders user image and name', () => {
        render(<UserImageAndName {...mockProps} />)
        
        const image = screen.getByAltText(mockProps.name)
        const name = screen.getByText(mockProps.name)
        
        expect(image).toBeInTheDocument()
        expect(name).toBeInTheDocument()
    })

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn()
        render(<UserImageAndName {...mockProps} onClick={handleClick} />)
        
        const container = screen.getByText(mockProps.name).parentElement
        fireEvent.click(container!)
        
        expect(handleClick).toHaveBeenCalled()
    })
})
