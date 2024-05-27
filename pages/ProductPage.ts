import { BasePage } from "./BasePage";
import faker from "faker";

export class ProductPage extends BasePage {
  async addProduct() {
    // Click on Add a new product icon
    await this.clickElement(".add-product a");

    // Generate random product name and description
    const randomProductName = faker.commerce.productName();
    const randomDescription = this.generateRandomDescription(40);
    const randomPrice = faker.datatype
      .number({ min: 30, max: 1000 })
      .toString();

    // Fill in new product data
    await this.fillInputField('input[name="title"]', randomProductName);
    await this.fillInputField('input[name="description"]', randomDescription);
    await this.fillInputField('input[name="price"]', randomPrice);

    // Click on the submit button
    await this.clickElement("button.submit-product");

    // Wait for the search field to be visible after submission
    await this.waitForSelector('input[placeholder="Search for products ..."]');

    return randomProductName; // Return the product name for further verification
  }

  async searchProduct(productName: string) {
    await this.fillInputField(
      'input[placeholder="Search for products ..."]',
      productName
    );
    await this.page.keyboard.press("Enter");
    await this.waitForTimeout(3000);
    return await this.page.textContent(".product-name");
  }

  async searchNotExistedProduct(productName: string) {
    await this.fillInputField("input.search-product", productName);
    await this.page.keyboard.press("Enter");
    await this.waitForTimeout(3000);
    return await this.page.textContent(".empty-result");
  }

  async deleteProduct() {
    const itemTitleSelector = ".product-name";
    const itemTitle = await this.page.textContent(itemTitleSelector);
    console.log("Item Title to Delete:", itemTitle);

    const deleteButtonSelector = "button.remove-product";
    await this.clickElement(deleteButtonSelector);
    // await this.waitForTimeout(4000);
    await this.searchNotExistedProduct(itemTitle || "");
    const result = await this.page.textContent(".empty-result");
    console.log(result);
    return result;
  }

  async editProduct() {
    const editProductButtonSelector = ".edit-product";
    await this.clickElement(editProductButtonSelector);

    const randomProductName = faker.commerce.productName();
    const randomDescription = this.generateRandomDescription(40);
    const randomPrice = faker.datatype.number({ min: 1, max: 1000 }).toString();

    await this.fillInputField('input[name="title"]', randomProductName);
    await this.fillInputField('input[name="description"]', randomDescription);
    await this.fillInputField('input[name="price"]', randomPrice);

    await this.clickElement("button.submit-product");

    await this.waitForSelector('input[placeholder="Search for products ..."]');

    return randomProductName;
  }

  generateRandomDescription(minLength: number): string {
    let description = "";

    while (description.length < minLength) {
      description = faker.lorem.paragraph();
    }

    description = description.substring(0, minLength);
    return description.trim();
  }
}
