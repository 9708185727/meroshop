// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import axios from "axios"; // For making GraphQL requests

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// API routes
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use(express.json());

// Fetch store info (including store name via GraphQL)
app.get("/api/store/info", async (req, res) => {
  try {
    const storeInfo = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });

    // GraphQL query to fetch shop name
    const graphqlQuery = `
      {
        shop {
          name
        }
      }
    `;
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    // Perform the GraphQL request
    const response = await client.request(graphqlQuery);

    // Correct way to access the shop name
    const shopName = response.data.shop.name;  // Corrected access

    // Sending both store information and shop name
    res.status(200).json({
      storeInfo,
      shopName,
    });
  } catch (error) {
    console.error("Error fetching shop info:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Fetching the 5 most sold products
app.get("/api/products/top-sold", async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const query = `
      query {
        orders(first: 100) {
          edges {
            node {
              lineItems(first: 100) {
                edges {
                  node {
                    quantity
                    title
                    product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await client.request(query);

    // Process the data to get the top 5 products by sold quantity
    let productQuantities = {};

    result.data.orders.edges.forEach((order) => {
      order.node.lineItems.edges.forEach((item) => {
        const productName = item.node.title;
        const quantity = item.node.quantity;

        if (!productQuantities[productName]) {
          productQuantities[productName] = 0;
        }

        productQuantities[productName] += quantity;
      });
    });

    // Sort products by quantity
    const sortedProducts = Object.keys(productQuantities)
      .map((product) => ({
        name: product,
        quantity: productQuantities[product],
      }))
      .sort((a, b) => b.quantity - a.quantity);

    const top5Products = sortedProducts.slice(0, 5);

    res.status(200).json(top5Products);
  } catch (error) {
    console.error("Error fetching top sold products:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Fetching the 5 most valuable customers
app.get("/api/customers/top-value", async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const query = `
      query {
        customers(first: 100) {
          edges {
            node {
              id
              email
              ordersCount
              totalSpent
            }
          }
        }
      }
    `;

    const result = await client.request(query);

    // Sort customers by totalSpent (value of purchases)
    const sortedCustomers = result.data.customers.edges
    
      .map((customer) => ({
        name: customer.node.email,
        totalSpent: parseFloat(customer.node.totalSpent),
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    const top5Customers = sortedCustomers.slice(0, 5);

    res.status(200).json(top5Customers);
  } catch (error) {
    console.error("Error fetching top customers:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Other API routes (example for product count)
app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), (_req, res, next) => {
  try {
    const htmlContent = readFileSync(join(STATIC_PATH, "index.html"))
      .toString()
      .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "");
    res.status(200).set("Content-Type", "text/html").send(htmlContent);
  } catch (err) {
    console.error("Error during request:", err);
    next(err); // Forward error to error-handling middleware
  }
});

app.listen(PORT);
