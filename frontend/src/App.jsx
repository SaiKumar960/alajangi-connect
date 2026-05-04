import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import LaunchScreen from './components/common/LaunchScreen';

const App = () => {
  const [showLaunch, setShowLaunch] = useState(true);

  return (
    <>
      {showLaunch && <LaunchScreen onComplete={() => setShowLaunch(false)} />}
      <AppRoutes />
    </>
  );
};

export default App;
