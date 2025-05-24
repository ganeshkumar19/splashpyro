import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchCategories } from '../apifunctions/categoriesApi';
import { fetchCategoryItems } from '../apifunctions/itemsApi';

// Create the context
const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [categoryItems, setCategoryItems] = useState({});  // Holds items for each categoryId
    const [itemQuantities, setItemQuantities] = useState({});
    const [cart, setCart] = useState([]);
    const [netTotal, setNetTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [savings, setSavings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [itemLoading, setItemLoading] = useState({});

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategoryItems = async (categoryId) => {
        if (!categoryItems[categoryId]) {
            setItemLoading((prev) => ({ ...prev, [categoryId]: true }));
            try {
                const items = await fetchCategoryItems(categoryId);
                setCategoryItems((prevItems) => ({
                    ...prevItems,
                    [categoryId]: items,
                }));
                // Initialize itemQuantities with 0 for each item
                const initialQuantities = {};
                items.forEach(item => {
                    if (!itemQuantities[item.id]) {
                        initialQuantities[item.id] = 0;
                    }
                });
                setItemQuantities((prev) => ({ ...prev, ...initialQuantities }));
            } catch (error) {
                console.error(`Error loading items for category ${categoryId}:`, error);
            } finally {
                setItemLoading((prev) => ({ ...prev, [categoryId]: false }));
            }
        }
    };

    useEffect(() => {
        loadCategories();  // Fetch categories on mount
    }, []);

    

    const updateTotals = (item, qtyChange, isAddition) => {
        const itemTotal = item.discountPrice * qtyChange;
        const itemSavings = (item.originalPrice - item.discountPrice) * qtyChange;
    
        setNetTotal(prev => {
            const newNetTotal = prev + (isAddition ? itemTotal : -itemTotal);
            
            // If net total is below 3000, add 100. If it's 3000 or more, remove the 100 shipping charge.
            let newGrandTotal;
            if (newNetTotal >= 3000 && prev < 3000) {
                newGrandTotal = newNetTotal; // Remove the 100 when crossing 3000
            } else if (newNetTotal < 3000 && prev >= 3000) {
                newGrandTotal = newNetTotal + 100; // Add the 100 back when going below 3000
            } else {
                newGrandTotal = newNetTotal < 3000 ? newNetTotal + 100 : newNetTotal; // Normal condition
            }
    
            setGrandTotal(newGrandTotal > 0 ? newGrandTotal : 0);
            return newNetTotal;
        });
    
        setSavings(prevSavings => {
            const newSavings = prevSavings + (isAddition ? itemSavings : -itemSavings);
            return newSavings;
        });
    };

    const handleIncrease = (item, totalQuantity) => {
        if (itemQuantities[item.id] < totalQuantity) {
            setItemQuantities(prev => ({ ...prev, [item.id]: prev[item.id] + 1 }));
            updateTotals(item, 1, true);

            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === item.id) {
                    const newQuantity = cartItem.quantity + 1;
    
                    // Update netTotal based on new quantity
                    const updatedNetTotal = cartItem.discountPrice * newQuantity;
    
                    return { 
                        ...cartItem, 
                        quantity: newQuantity,
                        netTotal: updatedNetTotal // Update netTotal for this item
                    };
                }
              return cartItem;
            });
      
            if (cart.some(cartItem => cartItem.id === item.id)) {
              setCart(updatedCart);
            }
        } else {
            toast.warn("You are entering more than the available quantity.");
        }
      };
      
      const handleDecrease = (item) => {
        if (itemQuantities[item.id] > 0) {
            setItemQuantities(prev => ({ ...prev, [item.id]: prev[item.id] - 1 }));
    
            if (itemQuantities[item.id] === 1) {
                removeFromCart(item.id);
                updateTotals(item, 1, false);
            } else {
                updateTotals(item, 1, false);  // Correctly updating totals on item decrease
    
                if (cart.some(cartItem => cartItem.id === item.id)) {
                    const updatedCart = cart.map(cartItem => {
                        if (cartItem.id === item.id) {
                            const newQuantity = cartItem.quantity - 1;
        
                            // Update netTotal based on new quantity
                            const updatedNetTotal = cartItem.discountPrice * newQuantity;
        
                            return { 
                                ...cartItem, 
                                quantity: newQuantity,
                                netTotal: updatedNetTotal 
                            };
                        }
                        return cartItem;
                    }).filter(cartItem => cartItem.quantity > 0);  // This should be redundant now but kept for safety
    
                    setCart(updatedCart);
                }
            }
        }
    };

      const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
      };





   

  return (
    <ProductsContext.Provider value={{ 
        categories,
        categoryItems,
        loadCategoryItems, 
        itemQuantities,
        cart,
        setCart,
        netTotal,
        grandTotal,
        savings,
        removeFromCart,
        handleIncrease,
        handleDecrease,
        updateTotals,
        loading ,
        itemLoading }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook to use the products context
export const useProducts = () => useContext(ProductsContext);

