const sidebars = {
  mainSidebar: [

    'Introduction',

    // ── How to Guides ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'How to Guides',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Get Your Credentials',
          collapsed: true,
          items: [
            'guides/personal-access-tokens',
            'guides/oauth',
          ],
        },
        {
          type: 'category',
          label: 'Getting Started',
          link: { type: 'doc', id: 'guides/getting-started' },
          collapsed: true,
          items: [
            'guides/shops',
            'guides/product',
          ],
        },
        'guides/going-live',
        'guides/versioning',
        'guides/errors-guide',
      ],
    },

    // ── API Reference ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'API Reference',
      className: 'sidebar-section',
      link: { type: 'doc', id: 'API-reference/index' },
      collapsed: true,
      items: [

        // ── Webhooks ──────────────────────────────────────────────
        {
          type: 'category',
          label: 'Webhooks Overview',
          collapsed: true,
          items: [
            'API-reference/webhooks/overview',
            'API-reference/webhooks/payload',
            'API-reference/webhooks/testing',
            'API-reference/webhooks/retries',
          ],
        },
        {
          type: 'category',
          label: 'Webhooks',
          link: { type: 'generated-index', title: 'Webhooks', description: 'Subscribe to real-time event notifications instead of polling. Register an HTTPS URL for an event type (currently receipts.update), retrieve a registered webhook by ID, or remove it when you no longer need it. See Webhooks Overview for the payload format, testing and retry behaviour.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/webhooks/get-webhook', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/webhooks/create-webhook', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/webhooks/delete-webhook', className: 'api-method api-method--delete' },
          ],
        },

        // ── Categories ────────────────────────────────────────────
        {
          type: 'category',
          label: 'Categories',
          link: { type: 'generated-index', title: 'Categories', description: 'Categories are the top-level groups that organize your catalog for menus and reporting. Every product must belong to one. List categories (filter by IDs or creation date, paginated with limit and cursor), create one with a name and optional item classification code, or delete one by category_id.' },
          collapsed: true,
          items: [
            'guides/categories',
            { type: 'doc', id: 'API-reference/categories/get-categories', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/categories/create-category', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/categories/delete-category', className: 'api-method api-method--delete' },
          ],
        },

        // ── Sub Categories ────────────────────────────────────────
        {
          type: 'category',
          label: 'Sub Categories',
          link: { type: 'generated-index', title: 'Sub Categories', description: 'Sub categories split a category into finer groups so large catalogs stay easy to browse. Each sub category belongs to a parent category_id. List them (filter by IDs or creation date), create one under a category, or delete one using its category_id and sub_category_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/sub-categories/get-sub-categories', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/sub-categories/create-sub-category', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/sub-categories/delete-sub-category', className: 'api-method api-method--delete' },
          ],
        },

        // ── Measurements ──────────────────────────────────────────
        {
          type: 'category',
          label: 'Measurements',
          link: { type: 'generated-index', title: 'Measurements', description: 'Measurements are the units products are sold and stocked in, such as kg, pcs or litre. List existing units, create a new one (optionally enabling weight-scale support for items sold by weight), or delete one by measurement_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/measurements/get-measurements', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/measurements/create-measurement', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/measurements/delete-measurement', className: 'api-method api-method--delete' },
          ],
        },

        // ── Taxes ─────────────────────────────────────────────────
        {
          type: 'category',
          label: 'Taxes',
          link: { type: 'generated-index', title: 'Taxes', description: 'Manage the tax rates and charges applied to products and receipts. A tax is either a TAX or a CHARGE, calculated as ADDED, INCLUDED or FIXED, and can be applied after other taxes and limited to specific shops. List taxes, create one, or remove one from selected shops by tax_code.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/taxes/get-taxes', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/taxes/create-tax', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/taxes/delete-tax', className: 'api-method api-method--delete' },
          ],
        },

        // ── Customers ─────────────────────────────────────────────
        {
          type: 'category',
          label: 'Customers',
          link: { type: 'generated-index', title: 'Customers', description: 'Customer profiles attached to sales. A profile holds contact details (name, email, phone, address) and business details such as billing name, VAT/TIN numbers, ID documents and credit limit. List customers (filter by IDs, email or creation date), create one, or delete one by customer_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/customers/get-customers', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/customers/create-customer', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/customers/delete-customer', className: 'api-method api-method--delete' },
          ],
        },

        // ── Employee ──────────────────────────────────────────────
        {
          type: 'category',
          label: 'Employee',
          link: { type: 'generated-index', title: 'Employee', description: 'Retrieve the employees registered in your POS, filtered by employee IDs or creation date and paginated with limit and cursor. Read-only. Pair with Timecards to see clock-in / clock-out records.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/employee/get-employees', className: 'api-method api-method--get' },
          ],
        },

        // ── Suppliers ─────────────────────────────────────────────
        {
          type: 'category',
          label: 'Suppliers',
          link: { type: 'generated-index', title: 'Suppliers', description: 'Suppliers are the vendors you purchase stock from, referenced by GRNs and purchase orders. Each supplier has a name, contact details and a type (Cash, Credit or N/A). List suppliers (filter by IDs or last update), create one, or delete one by supplier_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/suppliers/get-suppliers', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/suppliers/create-supplier', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/suppliers/delete-supplier', className: 'api-method api-method--delete' },
          ],
        },

        // ── Products ──────────────────────────────────────────────
        {
          type: 'category',
          label: 'Products',
          link: { type: 'generated-index', title: 'Products', description: 'Products are the items your merchants sell. Each product belongs to a category and can carry a sub category, measurement unit, cost, barcode, taxes, modifiers, per-shop pricing, stock control settings and up to three variant options. List products (filter by IDs, creation or update date) or create a new product. Products cannot be deleted through the API.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/products/get-products', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/products/create-product', className: 'api-method api-method--post' },
          ],
        },

        // ── Product Image ─────────────────────────────────────────
        {
          type: 'category',
          label: 'Product Image',
          link: { type: 'generated-index', title: 'Product Image', description: 'Attach an image to a product identified by its product_code, or remove it. Upload uses multipart/form-data; uploading again replaces the existing image.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/product-image/upload-image', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/product-image/delete-image', className: 'api-method api-method--delete' },
          ],
        },

        // ── Receipts ──────────────────────────────────────────────
        {
          type: 'category',
          label: 'Receipts',
          link: { type: 'generated-index', title: 'Receipts', description: 'Receipts are the completed sales (invoices) recorded by the POS. Retrieve receipts, void receipts and credit notes / cash refunds, filtered by receipt numbers, shop and creation date. Issue a CREDIT_NOTE or CASH_REFUND against an existing receipt by listing the returned line products.' },
          collapsed: true,
          items: [
            'guides/receipt',
            { type: 'doc', id: 'API-reference/receipts/get-receipts', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/receipts/get-void-receipts', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/receipts/get-credit-notes', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/receipts/create-credit-note', className: 'api-method api-method--post' },
          ],
        },

        // ── Orders ────────────────────────────────────────────────
        {
          type: 'category',
          label: 'Orders',
          link: { type: 'generated-index', title: 'Orders', description: 'Retrieve orders placed through the POS, filtered by order numbers, shop and creation date and paginated with limit and cursor. Read-only. To send orders into the POS from an external channel, use Online Orders.' },
          collapsed: true,
          items: [
            'guides/order-integration',
            { type: 'doc', id: 'API-reference/orders/get-orders', className: 'api-method api-method--get' },
          ],
        },

        // ── Shops ─────────────────────────────────────────────────
        {
          type: 'category',
          label: 'Shops',
          link: { type: 'generated-index', title: 'Shops', description: 'Shops are the physical locations under your merchant account. Most other endpoints take a shop_id, so this is usually your first call. List shops, filtered by shop IDs or last update. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/shops/get-shops', className: 'api-method api-method--get' },
          ],
        },

        // ── Payment Types ─────────────────────────────────────────
        {
          type: 'category',
          label: 'Payment Types',
          link: { type: 'generated-index', title: 'Payment Types', description: 'Manage the payment methods accepted at checkout. Each payment type has a code, a name, a category (Card, Cheque or Other) and a status. List payment types (filter by IDs, creation or update date), create one, or delete one by payment_type_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/payment-types/get-payment-types', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/payment-types/create-payment-type', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/payment-types/delete-payment-type', className: 'api-method api-method--delete' },
          ],
        },

        // ── Order Types ───────────────────────────────────────────
        {
          type: 'category',
          label: 'Order Types',
          link: { type: 'generated-index', title: 'Order Types', description: 'Order types describe how an order is fulfilled, such as dine-in, takeaway or delivery. List order types, create one with a name and status, or delete one by order_type_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/order-types/get-order-types', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/order-types/create-order-type', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/order-types/delete-order-type', className: 'api-method api-method--delete' },
          ],
        },

        // ── Modifiers ───────────────────────────────────────────────
        {
          type: 'category',
          label: 'Modifiers',
          link: { type: 'generated-index', title: 'Modifiers', description: 'Modifiers are the add-ons and options a customer can choose for a product (extra cheese, size, etc.), organized in modifier groups. List modifiers (filter by IDs, creation or update date) or delete a modifier group by modifier_group_id.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/modifiers/get-modifiers', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/modifiers/delete-modifier', className: 'api-method api-method--delete' },
          ],
        },

        // ── Inventory ───────────────────────────────────────────────
        {
          type: 'category',
          label: 'Inventory',
          link: { type: 'generated-index', title: 'Inventory', description: 'Read and update stock levels for each product in each shop. Get inventory filtered by product and shop IDs, or post new inventory levels to adjust stock after counts or external movements.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/inventory/get-inventory', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/inventory/update-inventory', className: 'api-method api-method--post' },
          ],
        },

        // ── GRN ─────────────────────────────────────────────────────
        {
          type: 'category',
          label: 'GRN',
          link: { type: 'generated-index', title: 'GRN', description: 'Goods Received Notes record stock arriving from a supplier into a shop. List GRNs (filter by shop, GRN number, status or creation date) or create a GRN with the supplier, shop, date, payment method, supplier invoice number, total and received items.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/grn/get-grn', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/grn/create-grn', className: 'api-method api-method--post' },
          ],
        },

        // ── Purchase Orders ─────────────────────────────────────────
        {
          type: 'category',
          label: 'Purchase Orders',
          link: { type: 'generated-index', title: 'Purchase Orders', description: 'Retrieve purchase orders raised to suppliers, filtered by shop IDs, PO numbers or creation date and paginated with limit and cursor. Read-only. Stock that arrives against an order is recorded as a GRN.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/purchase-orders/get-purchase-orders', className: 'api-method api-method--get' },
          ],
        },

        // ── Online Orders ───────────────────────────────────────────
        {
          type: 'category',
          label: 'Online Orders',
          link: { type: 'generated-index', title: 'Online Orders', description: 'Send orders from an external channel (website, marketplace, delivery app) into the POS. Place an order with its customer, items, charges, discounts and payments; check its status by system unique ID; or cancel it using the same ID.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/online-orders/place-online-order', className: 'api-method api-method--post' },
            { type: 'doc', id: 'API-reference/online-orders/get-online-order-status', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/online-orders/cancel-online-order', className: 'api-method api-method--post' },
          ],
        },

        // ── Shifts ──────────────────────────────────────────────────
        {
          type: 'category',
          label: 'Shifts',
          link: { type: 'generated-index', title: 'Shifts', description: 'Retrieve cashier shifts and the drawer pay-in / pay-out transactions recorded during them, filtered by shop, POS device, shift IDs or creation date. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/shifts/get-shifts', className: 'api-method api-method--get' },
            { type: 'doc', id: 'API-reference/shifts/get-drawer-transactions', className: 'api-method api-method--get' },
          ],
        },

        // ── Timecards ───────────────────────────────────────────────
        {
          type: 'category',
          label: 'Timecards',
          link: { type: 'generated-index', title: 'Timecards', description: 'Retrieve employee clock-in / clock-out records, filtered by shop IDs, employee IDs or creation date and paginated with limit and cursor. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/timecards/get-timecards', className: 'api-method api-method--get' },
          ],
        },

        // ── POS Devices ─────────────────────────────────────────────
        {
          type: 'category',
          label: 'POS Devices',
          link: { type: 'generated-index', title: 'POS Devices', description: 'List the POS terminals registered under each shop, filtered by POS keys or creation date. Use a device ID to filter shifts and drawer transactions or target an online order. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/pos-devices/get-pos-devices', className: 'api-method api-method--get' },
          ],
        },

        // ── Merchant ────────────────────────────────────────────────
        {
          type: 'category',
          label: 'Merchant',
          link: { type: 'generated-index', title: 'Merchant', description: 'Retrieve your merchant account information. Takes no parameters. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/merchant/get-merchant', className: 'api-method api-method--get' },
          ],
        },

        // ── Pagination ────────────────────────────────────────────
        'API-reference/pagination',
        'API-reference/rate-limits',
        'API-reference/date-time-format',

      ],
    },


    'glossary',
    'changelog',
  ],
};

export default sidebars;