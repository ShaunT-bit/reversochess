import { ChessBoard } from '../components/ChessBoard';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-2">Chess Game</h1>
          <p className="text-xl text-muted-foreground">Classic chess with modern design</p>
        </header>
        
        <main className="flex justify-center">
          <ChessBoard />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
