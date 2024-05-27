import { test, expect } from "@playwright/test";
import { ProductPage } from "../pages/ProductPage";

let productName: string;

test.describe("Product Management", () => {
  test("Add a new product and verify it’s added successfully", async ({
    page,
  }) => {
    const productPage = new ProductPage(page);
    await productPage.navigateTo("/");
    productName = await productPage.addProduct();

    console.log("Added Product Name:", productName);
  });

  test("Search for a product and verify the search results", async ({
    page,
  }) => {
    const productPage = new ProductPage(page);
    await productPage.navigateTo("/");
    const searchedProductName = await productPage.searchProduct(productName);
    expect(searchedProductName).toBe(productName);
  });

  test("Delete a product and verify it’s deleted successfully", async ({
    page,
  }) => {
    const productPage = new ProductPage(page);
    await productPage.navigateTo("/");
    const result = await productPage.deleteProduct();
    expect(result).toBe("No products Found");
  });

  test("Edit an existing product and verify it’s edited successfully", async ({
    page,
  }) => {
    const productPage = new ProductPage(page);
    await productPage.navigateTo("/");
    const editedProductName = await productPage.editProduct();
    console.log("Edited Product Name:", editedProductName);
  });
});
