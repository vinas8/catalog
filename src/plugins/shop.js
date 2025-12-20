export default {
  id: "shop",
  // Minimal catalog entries: product_id matches entity id in snakes plugin.
  // payment_link: placeholder to Stripe Payment Link URL for the product.
  catalog: [
    {
      product_id: "corn_snake",
      price_text: "$4.99",
      // Replace this with your Stripe Payment Link URL when ready
      payment_link: "https://buy.stripe.com/test_corn_snake_payment_link",
      description: "Start with a friendly Corn Snake"
    },
    {
      product_id: "king_snake",
      price_text: "$7.99",
      payment_link: "https://buy.stripe.com/test_king_snake_payment_link",
      description: "A harderier King Snake"
    }
  ],
  ui: {
    title: "Shop"
  }
};
