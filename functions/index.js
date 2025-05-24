const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
const express = require('express');
const app = express();
const { Firestore } = require("firebase-admin/firestore");

admin.initializeApp();
const db = admin.firestore();

// Allowed origins for CORS
const allowedOrigins = [
    'https://splashpyro.in',
    'https://splashpyro-115e8.web.app',
    'http://localhost:5173'  // Add localhost during development
];

// Use the cors package with proper configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // If you need to handle credentials (optional)
}));

// Handle preflight OPTIONS request globally
app.options('*', cors()); // Allow preflight for all routes

// Fetch categories
app.get('/categories', async (req, res) => {
    try {
        const categoriesRef = db.collection('crackers');
        const snapshot = await categoriesRef.orderBy("categoryId", "asc").get();
        
        // Map through the snapshot and build an array with categoryName and categoryId
        const categories = snapshot.docs.map(doc => ({
            categoryId: doc.data().categoryId,
            categoryName: doc.data().category
        }));
        
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send(error.toString());
    }
});

// Fetch items by category
app.get('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        // First, fetch the category document with the matching categoryId
        const categoriesRef = db.collection('crackers').where('categoryId', '==', Number(categoryId));
        const categorySnapshot = await categoriesRef.get();

        if (categorySnapshot.empty) {
            res.status(404).send('Category not found for ID: ' + categoryId);
            return;
        }
        const categoryDoc = categorySnapshot.docs[0];
        const categoryDocId = categoryDoc.id;

        // Now, fetch items from the "items" sub-collection of this category document
        const itemsRef = db.collection('crackers').doc(categoryDocId).collection('items');
        const itemsSnapshot = await itemsRef.get();

        if (itemsSnapshot.empty) {
            res.status(404).send('No items found for category ID: ' + categoryId);
        } else {
            // Map the items to an array and return them
            const items = itemsSnapshot.docs.map(doc => doc.data());
            res.status(200).json(items);
        }
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send(error.toString());
    }
});

app.post('/checkout', async (req, res) => {
    const { name, mobile, address, cart } = req.body;

    if (!name || !mobile || !address || !cart || cart.length === 0) {
        res.status(400).send('Missing details or empty cart.');
        return;
    }

    try {
        let userRef;
        let customUserId = '';  // To hold the custom user ID (SPC01##)

        // Fetch the current user counter
        const counterRef = db.collection('counters').doc('userCounter');
        const counterSnapshot = await counterRef.get();

        if (!counterSnapshot.exists) {
            // Initialize the counter if it doesn't exist
            await counterRef.set({ currentUserId: 0 });  // Start from 0 to generate SPC0100
            customUserId = `SPC0100`;
        } else {
            // Get the current user ID and increment it
            const currentUserId = counterSnapshot.data().currentUserId;
            const newUserId = currentUserId + 1;

            // Update the counter in Firestore
            await counterRef.update({ currentUserId: newUserId });

            // Generate custom user ID (e.g., SPC0100, SPC0101, SPC0102, etc.)
            customUserId = `SPC01${newUserId.toString().padStart(2, '0')}`;
        }

        // Create a new user with the generated custom user ID
        userRef = db.collection('users').doc();  // Let Firestore auto-generate the ID
        await userRef.set({
            name,
            mobile,
            address,
            userId: customUserId,  // Add the custom user ID to the user document
            createdAt: Firestore.FieldValue.serverTimestamp(),
        });

        const orderCounterRef = db.collection('counters').doc('orderCounter');
        const orderCounterSnapshot = await orderCounterRef.get();

        if (!orderCounterSnapshot.exists) {
            // Initialize the order counter if it doesn't exist
            await orderCounterRef.set({ currentOrderId: 1 });  // Start from 1 for the first order
            orderId = 1;
        } else {
            // Get the current order ID and increment it
            const currentOrderId = orderCounterSnapshot.data().currentOrderId;
            const newOrderId = currentOrderId + 1;

            // Update the order counter in Firestore
            await orderCounterRef.update({ currentOrderId: newOrderId });

            // Assign the new order ID
            orderId = newOrderId;
        }

        await db.collection('carts').doc(userRef.id).set({
            userId: customUserId, 
            orderId: orderId,
            items: cart.filter(item => item !== undefined),  
            createdAt: Firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).send({ message: 'Checkout successful', userId: customUserId });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Error during checkout.');
    }
});

app.get('/carts', async (req, res) => {
    try {
        // Step 1: Fetch all cart documents
        const cartsRef = db.collection('carts');
        const cartsSnapshot = await cartsRef.get();

        if (cartsSnapshot.empty) {
            res.status(404).send('No carts found');
            return;
        }

        const carts = [];

        // Step 2: Iterate through each cart document
        for (const cartDoc of cartsSnapshot.docs) {
            const cartData = cartDoc.data();
            const userId = cartData.userId;
            const orderId = cartData.orderId;
            const items = cartData.items;
            const createdAt = cartData.createdAt ? cartData.createdAt.toDate() : null; 

            // Step 3: Fetch user details using the userId from the cart
            const userRef = db.collection('users').where('userId', '==', userId);
            const userSnapshot = await userRef.get();

            if (userSnapshot.empty) {
                console.error(`User not found for userId: ${userId}`);
                continue;  // Skip this cart if the user is not found
            }

            const userDoc = userSnapshot.docs[0]; // Get the user document
            const userData = userDoc.data();

            // Step 4: Calculate the cartTotal by summing the netTotal of all items in the cart
            let cartTotal = items.reduce((total, item) => total + (item.netTotal || 0), 0);  // Use 'let'

            if (cartTotal < 3000) {
                cartTotal += 100;  // Now this is allowed since 'cartTotal' is declared with 'let'
            }

            // Step 5: Prepare the final cart data with user details and cart total
            carts.push({
                orderId: orderId,
                userId: userId,
                userName: userData.name,
                userAddress: userData.address,
                userMobile: userData.mobile,
                cartTotal: cartTotal,
                items: items,
                createdAt: createdAt,  
            });
        }

        // Step 6: Return the carts array as the response
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).send('Error fetching carts');
    }
});




exports.api = functions.https.onRequest(app);