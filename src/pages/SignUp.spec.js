import SignUp from './SignUp.svelte';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/extend-expect'


it('has sign up header', () => {
    render(SignUp);

    const header = screen.getByRole('heading', {
        name: 'Sign Up'
    });
    expect(header).toBeInTheDocument();
});