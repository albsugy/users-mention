import { render, screen } from "@testing-library/react";
import IndexPage from "../pages/index";

describe("App", () => {
  it("renders without crashing", () => {
    render(<IndexPage />);
    expect(
      screen.getByTestId("mention-textarea")
    ).toBeInTheDocument();
  });
});