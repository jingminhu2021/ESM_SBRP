import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import login from '../components/login.jsx'
import userEvent from '@testing-library/user-event'

const onSubmit = jest.fn()
beforeEach(() => {
    render(<login onSubmitForTest={onSubmit} />)
    onSubmit.mockClear()
})

test('Login', async() => {
    const email = screen.getByTestId('email')
    const password = screen.getByTestId('password')
    userEvent.type(email, 'testEmail')
    userEvent.type(password, 'testPassword')

    userEvent.click(screen.getByTestId('login'))

    await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1)
    })
})