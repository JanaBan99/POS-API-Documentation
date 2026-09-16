const sidebars = {
  mainSidebar: [

    'Introduction',

    // ── How to Guides ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'How to Guides',
      collapsed: true,
      items: [
        'guides/getting-started',
        'guides/versioning',
        {
          type: 'category',
          label: 'Get Your Credentials',
          collapsed: true,
          items: [
            'guides/personal-access-tokens',
            'guides/oauth',
          ],
        },
        'guides/product',
        'guides/going-live',
        'guides/errors-guide',
      ],
    },

    // ── API Reference ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'API Reference',
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
          link: { type: 'generated-index', title: 'Webhooks', description: 'Subscribe to real-time event notifications — register, retrieve, and remove webhook URLs.' },
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
          link: { type: 'generated-index', title: 'Categories', description: 'Organize products into top-level groups for menus and reporting.' },
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
          link: { type: 'generated-index', title: 'Sub Categories', description: 'Split categories into finer groups to keep large catalogs navigable.' },
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
          link: { type: 'generated-index', title: 'Measurements', description: 'Define the units (kg, pcs, litre, etc.) products are sold and stocked in.' },
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
          link: { type: 'generated-index', title: 'Taxes', description: 'Manage tax rates applied to products and receipts.' },
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
          link: { type: 'generated-index', title: 'Customers', description: 'Create and manage customer profiles attached to sales.' },
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
          link: { type: 'generated-index', title: 'Employee', description: 'Retrieve the employees registered in your POS. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/employee/get-employees', className: 'api-method api-method--get' },
          ],
        },

        // ── Suppliers ─────────────────────────────────────────────
        {
          type: 'category',
          label: 'Suppliers',
          link: { type: 'generated-index', title: 'Suppliers', description: 'Manage the suppliers you purchase stock from.' },
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
          link: { type: 'generated-index', title: 'Products', description: 'Create and retrieve the products in your catalog, including pricing and stock details.' },
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
          link: { type: 'generated-index', title: 'Product Image', description: 'Upload or remove product images (multipart upload).' },
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
          link: { type: 'generated-index', title: 'Receipts', description: 'Retrieve sales receipts, void receipts, and credit notes; issue credit notes and refunds.' },
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
          link: { type: 'generated-index', title: 'Orders', description: 'Retrieve orders placed through the POS. Read-only.' },
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
          link: { type: 'generated-index', title: 'Shops', description: 'List the shops (locations) under your account. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/shops/get-shops', className: 'api-method api-method--get' },
          ],
        },

        // ── Payment Types ─────────────────────────────────────────
        {
          type: 'category',
          label: 'Payment Types',
          link: { type: 'generated-index', title: 'Payment Types', description: 'Manage the payment methods accepted at checkout (cash, card, etc.).' },
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
          link: { type: 'generated-index', title: 'Order Types', description: 'Manage order types such as dine-in, takeaway, and delivery.' },
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
          link: { type: 'generated-index', title: 'Modifiers', description: 'Retrieve and remove product modifiers (add-ons and options).' },
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
          link: { type: 'generated-index', title: 'Inventory', description: 'Read and update stock levels per product and shop.' },
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
          link: { type: 'generated-index', title: 'GRN', description: 'Retrieve and create Goods Received Notes for incoming stock.' },
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
          link: { type: 'generated-index', title: 'Purchase Orders', description: 'Retrieve purchase orders raised to suppliers. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/purchase-orders/get-purchase-orders', className: 'api-method api-method--get' },
          ],
        },

        // ── Online Orders ───────────────────────────────────────────
        {
          type: 'category',
          label: 'Online Orders',
          link: { type: 'generated-index', title: 'Online Orders', description: 'Place online orders into the POS, check their status, and cancel them.' },
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
          link: { type: 'generated-index', title: 'Shifts', description: 'Retrieve cashier shifts and drawer pay-ins / pay-outs. Read-only.' },
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
          link: { type: 'generated-index', title: 'Timecards', description: 'Retrieve employee clock-in / clock-out records. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/timecards/get-timecards', className: 'api-method api-method--get' },
          ],
        },

        // ── POS Devices ─────────────────────────────────────────────
        {
          type: 'category',
          label: 'POS Devices',
          link: { type: 'generated-index', title: 'POS Devices', description: 'List the POS terminals registered under each shop. Read-only.' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'API-reference/pos-devices/get-pos-devices', className: 'api-method api-method--get' },
          ],
        },

        // ── Merchant ────────────────────────────────────────────────
        {
          type: 'category',
          label: 'Merchant',
          link: { type: 'generated-index', title: 'Merchant', description: 'Retrieve your merchant account details. Read-only.' },
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