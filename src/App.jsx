import { useGitHubAPI } from './hooks/useGitHubAPI'
import Header from './components/Header'
import SystemMetrics from './components/SystemMetrics'
import WorkflowStatus from './components/WorkflowStatus'
import BuildChart from './components/BuildChart'

function App() {
  const { workflowRuns, loading, error } = useGitHubAPI();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <SystemMetrics workflowRuns={workflowRuns} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkflowStatus 
            workflowRuns={workflowRuns} 
            loading={loading} 
            error={error} 
          />
          <BuildChart workflowRuns={workflowRuns} />
        </div>
      </div>
    </div>
  )
}

export default App
