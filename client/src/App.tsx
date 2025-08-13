import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import SimpleHome from "@/pages/SimpleHome";
import Landing from "@/pages/Landing";
import Books from "@/pages/Books";
import Videos from "@/pages/Videos";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Admin from "@/pages/Admin";
import AdminBooks from "@/pages/AdminBooks";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import StoreComingSoon from "@/pages/store-coming-soon";
import TestPage from "@/pages/TestPage";
import { CartProvider } from "@/hooks/useCart";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/test" component={TestPage} />
      <Route path="/books" component={Books} />
      <Route path="/videos" component={Videos} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={() => <div>Payment Successful!</div>} />
      <Route path="/checkout/failed" component={() => <div>Payment Failed!</div>} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/books" component={AdminBooks} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/store" component={StoreComingSoon} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
