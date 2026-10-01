/**
 * Extra content for the API Reference category pages (sidebars.js `generated-index` links),
 * rendered by src/theme/DocCategoryGeneratedIndexPage. Keyed by the category title.
 * Every statement is taken from api_spec.yaml (request fields, enums, response fields) —
 * keep it that way. Text is brand-neutral ("the POS") because all brands share it.
 */
export default {
  Webhooks: {
    features: [
      ['Event notifications', 'Register an HTTPS URL and the POS calls it when a subscribed event happens, so you do not have to poll.'],
      ['Receipt updates', 'Subscribe to receipts.update to hear about sales as they are recorded.'],
      ['Status', 'Each webhook is registered with a status, returned when you look it up.'],
    ],
  },
  Categories: {
    features: [
      ['Top-level grouping', 'Every product belongs to a category; categories drive menus and sales reporting in the POS.'],
      ['Classification codes', 'Store an optional item_classification_code with each category.'],
    ],
  },
  'Sub Categories': {
    features: [
      ['Second level of grouping', 'Split a category into finer groups (for example Drinks → Hot, Cold) to keep large catalogs easy to browse.'],
      ['Linked to a parent', 'Each sub category is created under a category_id and is returned with its parent category name.'],
      ['Assign to products', 'Products carry an optional sub_category_id alongside their category.'],
    ],
  },
  Measurements: {
    features: [
      ['Units of sale', 'Define the units products are sold and stocked in: pieces, kg, litre, and so on.'],
      ['Weight-scale units', 'Mark a unit as weight-scale enabled with weight_scale_enable.'],
      ['Assign to products', 'Products reference a unit with measurement_id; GRN and purchase order items report it back.'],
    ],
  },
  Taxes: {
    features: [
      ['Taxes and charges', 'A rate is either a TAX or a CHARGE (such as a service charge).'],
      ['Three calculation methods', 'ADDED on top of the price, INCLUDED in the price, or a FIXED amount.'],
      ['Compound taxes', 'apply_tax_after_other_taxes applies one tax on top of the others.'],
      ['Per-shop rates', 'Apply a tax to selected shops, and remove it from selected shops by tax_code.'],
      ['Price-change setting', 'is_tax_price_change sets whether the tax affects price changes.'],
      ['On every sale', 'Receipts and orders break tax down per line (line_taxes) and in total (total_tax).'],
    ],
  },
  Customers: {
    features: [
      ['Contact details', 'Name, email, phone, address, city, region, postal code and country.'],
      ['Business customers', 'Billing and business name, VAT and TIN numbers, business registration number and ID documents.'],
      ['Credit limit', 'Set how much a customer may buy on credit.'],
      ['Visit and spend history', 'Responses include first and last visit, total visits, total spent and loyalty points.'],
      ['Memberships', 'See membership status, dates and the linked discount plan.'],
    ],
  },
  Employee: {
    features: [
      ['Staff directory', 'Every employee with name, phone and user role.'],
      ['Login identities', 'The POS user name and PIN, and the Back Office login email.'],
      ['Shop access', 'The shops each employee is assigned to.'],
      ['Read-only', 'Employees are listed here; there is no create or delete call.'],
    ],
  },
  Suppliers: {
    features: [
      ['Vendor records', 'Supplier name, your own supplier_id code, phone, email and address.'],
      ['Supplier types', 'Mark a supplier as Cash, Credit or N/A.'],
      ['Stock purchasing', 'GRNs and purchase orders reference the supplier they came from.'],
      ['Change tracking', 'List suppliers updated in an updated_at range to sync only what changed.'],
    ],
  },
  Products: {
    features: [
      ['Catalog placement', 'Category, sub category, unit of measurement, barcode and description.'],
      ['Per-shop pricing', 'Set price, availability and safety stock for each shop.'],
      ['Variants', 'Up to three option names (such as size and colour) with a variant for each combination.'],
      ['Composite items', 'Build a product from component products.'],
      ['Stock and tax behaviour', 'Stock control, expiry tracking, price- and quantity-change options, taxes and modifier groups.'],
    ],
  },
  'Product Image': {
    features: [
      ['Replace', 'Uploading again for the same product replaces the current image.'],
      ['Shown everywhere', 'Products return the stored image as image_url.'],
    ],
  },
  Receipts: {
    features: [
      ['Completed sales', 'Every receipt with its number, date and time, shop, POS device, employee and order type.'],
      ['Full line detail', 'Line products with quantity, price, cost, discounts, taxes and modifiers.'],
      ['Payments', 'Each payment with its type, amount and time.'],
      ['Voided sales', 'Voided receipts with who deleted them and when.'],
      ['Refunds', 'List credit notes and cash refunds, or issue a CREDIT_NOTE or CASH_REFUND against a receipt.'],
    ],
  },
  Orders: {
    features: [
      ['Orders from the POS', 'Order number, date and time, shop, device, employee and order type.'],
      ['Line detail', 'Products with quantity, price, discounts, taxes and modifiers.'],
      ['Payments and advances', 'Payments per order, including advance payments.'],
      ['Status', 'The current order status, and whether and when it was deleted.'],
    ],
  },
  Shops: {
    features: [
      ['Your locations', 'Every shop with name, address, phone, city and email.'],
      ['Map position', 'Latitude and longitude for each shop.'],
      ['Terminals', 'The POS terminals registered in each shop.'],
      ['Enabled state', 'Whether each shop is enabled.'],
      ['The shop_id', 'Most other endpoints filter or act by shop_id; start here to find it.'],
    ],
  },
  'Payment Types': {
    features: [
      ['Checkout methods', 'The ways customers pay: card, cheque and your own methods.'],
      ['Categories', 'Group a payment type as Card, Cheque or Other.'],
      ['Codes and status', 'Give each type a payment_type_code and turn it on or off.'],
      ['Per-shop status', 'See which shops each payment type is active in.'],
      ['Change tracking', 'Filter by created_at or updated_at ranges to sync changes.'],
    ],
  },
  'Order Types': {
    features: [
      ['Fulfilment types', 'Dine-in, takeaway, delivery, or any type your business uses.'],
      ['Enable or disable', 'Each order type has a status.'],
      ['On every sale', 'Receipts and orders record the order type they were rung up under.'],
    ],
  },
  Modifiers: {
    features: [
      ['Add-ons and options', 'Extras a customer can choose for a product, such as extra cheese or a size.'],
      ['Modifier groups', 'Modifiers are organised in groups; products link to groups by modifier group id.'],
      ['Price and cost', 'Each modifier has a code, name, price, cost and status.'],
      ['Per-shop', 'See which shops each group is available in.'],
    ],
  },
  Inventory: {
    features: [
      ['Stock on hand', 'The in-stock quantity for each product in each shop.'],
      ['Stock in', 'Incoming stock is recorded through GRNs.'],
    ],
  },
  GRN: {
    features: [
      ['Goods received', 'Record stock arriving from a supplier into a shop.'],
      ['Item detail', 'Products with quantity, unit cost, total cost and expiry date.'],
      ['Supplier invoice', 'Keep the supplier invoice number, payment method and GRN total.'],
      ['Extra costs', 'Additional costs such as freight are returned with each GRN.'],
    ],
  },
  'Purchase Orders': {
    features: [
      ['Orders to suppliers', 'PO number, supplier, shop, amount, order date and expected date.'],
      ['Item detail', 'Products with quantity, unit cost and total cost.'],
      ['Status and payment', 'PO status and the payment type used.'],
      ['Read-only', 'Purchase orders are listed here; stock that arrives is recorded as a GRN.'],
    ],
  },
  'Online Orders': {
    features: [
      ['Orders from other channels', 'Push orders from your website, marketplace or delivery app into the POS.'],
      ['Complete order data', 'Customer, items, fixed charges, discounts and payments in one request.'],
      ['Route to a terminal', 'Send an order to a table or to a specific POS terminal.'],
    ],
  },
  Shifts: {
    features: [
      ['Cash-up records', 'Every shift with who opened and closed it and when.'],
      ['Cash reconciliation', 'Starting cash, cash payments and refunds, paid in and out, and expected against actual cash.'],
      ['Sales summary', 'Gross sales, refunds, discounts, net sales, tips, surcharges and taxes per shift.'],
      ['Drawer movements', 'Pay-in and pay-out transactions with amount, reason and cashier.'],
    ],
  },
  Timecards: {
    features: [
      ['Attendance', 'Clock-in and clock-out records for each employee.'],
      ['Hours worked', 'Total hours per timecard.'],
      ['Per shop', 'Each record includes the shop it was recorded in.'],
    ],
  },
  'POS Devices': {
    features: [
      ['Registered terminals', 'Every POS device with its name, key and status.'],
      ['Linked to shops', 'The shop each device belongs to.'],
      ['Device IDs', 'Use pos_device_id to filter shifts and drawer transactions.'],
    ],
  },
  Merchant: {
    features: [
      ['Account details', 'Your business name, email and country.'],
      ['Currency', 'The currency code and number of decimal places used for money amounts.'],
    ],
  },
};
