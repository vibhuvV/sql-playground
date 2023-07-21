import { TooltipProvider } from '@/components/ui/tooltip';
import Toaster from '@/components/ui/toaster';
import { Sheet } from '@/components/ui/sheet';
import HomePage from '@/pages/home';

function App() {
  return (
    <Sheet>
      <TooltipProvider>
        <HomePage />
        <Toaster />
      </TooltipProvider>
    </Sheet>
  );
}

export default App;
