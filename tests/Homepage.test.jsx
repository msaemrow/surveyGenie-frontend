import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Homepage from '../src/components/Homepage';

describe("Homepage Component", () => {
  it("renders the Homepage", () => {
      render(<Homepage />);
  });
  it("displays the homepage title", () => {
      const { getByText } = render(<Homepage />);
      const title = getByText("SurveyGenie");
      expect(title).toBeInTheDocument();
  });
})
