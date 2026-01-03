import { formatDistanceToNow } from '../utils/helpers';

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const SystemMetrics = ({ workflowRuns }) => {
  const getMetrics = () => {
    if (!workflowRuns || workflowRuns.length === 0) {
      return {
        currentVersion: 'N/A',
        lastDeploy: 'N/A',
        successRate: '0%',
      };
    }

    // Get latest successful build
    const latestSuccessful = workflowRuns.find(
      (run) => run.conclusion === 'success'
    );

    // Calculate success rate from last 10 builds
    const last10 = workflowRuns.slice(0, 10);
    const successCount = last10.filter((run) => run.conclusion === 'success').length;
    const successRate = Math.round((successCount / last10.length) * 100);

    return {
      currentVersion: `v${latestSuccessful?.run_number || 'N/A'}`,
      lastDeploy: latestSuccessful
        ? formatDistanceToNow(latestSuccessful.created_at)
        : 'N/A',
      successRate: `${successRate}%`,
    };
  };

  const metrics = getMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MetricCard 
        title="Current Version" 
        value={metrics.currentVersion} 
        icon="🚀" 
      />
      <MetricCard 
        title="Last Deploy" 
        value={metrics.lastDeploy} 
        icon="⏱️" 
      />
      <MetricCard 
        title="Success Rate" 
        value={metrics.successRate} 
        icon="📊" 
      />
    </div>
  );
};

export default SystemMetrics;
