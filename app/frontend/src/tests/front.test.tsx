import {render, screen} from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('TEST: API Integration', () => {

it('Front: Render title', () => {
    render(<App/>)
    const title = screen.getByText(/Miks Energetyczny GB/i);
    expect(title).toBeInTheDocument();
});

})