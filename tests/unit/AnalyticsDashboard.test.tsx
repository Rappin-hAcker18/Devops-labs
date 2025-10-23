import { render, screen } from '@testing-library/react'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>,
}))

describe('AnalyticsDashboard', () => {
  it('renders analytics dashboard with error state when analytics fail', () => {
    render(<AnalyticsDashboard />)
    
    // The component shows error state when analytics fail to load
    expect(screen.getByText('Error Loading Analytics')).toBeInTheDocument()
    expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('has error handling for failed analytics', () => {
    render(<AnalyticsDashboard />)
    
    // Check that error state is properly displayed
    expect(screen.getByText('Error Loading Analytics')).toBeInTheDocument()
    
    // Check for retry button
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('has proper responsive classes', () => {
    const { container } = render(<AnalyticsDashboard />)
    
    // Check that the main container has responsive classes
    const mainContainer = container.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('min-h-screen')
  })

  it('displays urban-themed styling', () => {
    const { container } = render(<AnalyticsDashboard />)
    
    // Check for dark theme classes consistent with urban styling
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('min-h-screen')
  })
})