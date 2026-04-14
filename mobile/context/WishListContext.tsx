import { dummyWishlist } from "@/assets/gggg/assets";
import { Product, WishlistContextType } from "@/constants/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WithListContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishListProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    setLoading(true);
    setWishlist(dummyWishlist);
    setLoading(false);
  };

  const toggleWishlist = async (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WithListContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist }}
    >
      {children}
    </WithListContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WithListContext);
  if (context === undefined) {
    throw new Error("useWishlit must be used within a  wishlistProvider");
  }
  return context;
}
