import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'shree_vijay.db');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize schema
  initSchema(dbInstance);
  saveDb(dbInstance);

  return dbInstance;
}

export function saveDb(db: Database) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Error saving database to disk:', err);
  }
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'SUPER ADMIN',
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      username TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT,
      city TEXT DEFAULT 'Jabalpur',
      notes TEXT,
      total_enquiries INTEGER DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      description_hi TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subcategories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      slug TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      subcategory_id INTEGER,
      name TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      description TEXT,
      description_hi TEXT,
      price REAL NOT NULL,
      offer_price REAL,
      colour TEXT,
      size TEXT,
      fabric TEXT,
      material TEXT,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      stock_status TEXT DEFAULT 'In Stock',
      images TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      colour TEXT NOT NULL,
      size TEXT NOT NULL,
      price REAL NOT NULL,
      offer_price REAL,
      quantity INTEGER DEFAULT 10,
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      variant_id INTEGER,
      sku TEXT NOT NULL,
      colour TEXT,
      size TEXT,
      quantity INTEGER DEFAULT 0,
      min_threshold INTEGER DEFAULT 3,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_code TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      product_id INTEGER,
      product_name TEXT,
      category_id INTEGER,
      variant_info TEXT,
      colour TEXT,
      size TEXT,
      quantity INTEGER DEFAULT 1,
      budget TEXT,
      preferred_contact TEXT DEFAULT 'WhatsApp',
      message TEXT,
      status TEXT DEFAULT 'New',
      assigned_staff_id INTEGER,
      follow_up_date TEXT,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      product_name TEXT,
      staff_name TEXT,
      follow_up_date TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (enquiry_id) REFERENCES enquiries(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_status TEXT DEFAULT 'Pending',
      order_status TEXT DEFAULT 'Confirmed',
      assigned_staff_id INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_code TEXT UNIQUE NOT NULL,
      order_id INTEGER,
      enquiry_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      customer_address TEXT,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      amount_paid REAL DEFAULT 0,
      balance_due REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'Pending',
      payment_method TEXT DEFAULT 'Cash',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      transaction_ref TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    );

    CREATE TABLE IF NOT EXISTS website_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE NOT NULL,
      title_en TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      subtitle_en TEXT,
      subtitle_hi TEXT,
      content_json TEXT,
      is_enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_links (
      platform TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      is_enabled INTEGER DEFAULT 1,
      extra_config TEXT
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_name TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ceremonies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ceremony_key TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      hindi_aura TEXT,
      palette TEXT,
      description_en TEXT,
      description_hi TEXT,
      banner_tagline_en TEXT,
      banner_tagline_hi TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      attempts_count INTEGER DEFAULT 0,
      last_attempt DATETIME,
      locked_until DATETIME
    );
  `);

  // Run safe schema migrations for new columns if they do not exist
  safeMigrateSchema(db);

  // Seed default data if not present
  seedDefaultData(db);

  // Ensure ceremonies are seeded
  seedCeremonies(db);

  // Ensure all groom products are seeded into existing database if not yet present
  ensureGroomProductsExist(db);
}

function safeMigrateSchema(db: Database) {
  const tryAddCol = (table: string, colDef: string) => {
    try {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${colDef}`);
    } catch {
      // Column already exists or table altered
    }
  };

  tryAddCol('products', 'gender TEXT DEFAULT "female"');
  tryAddCol('products', 'occasion TEXT');
  tryAddCol('products', 'instagram_reel_url TEXT');
  tryAddCol('products', 'is_new_arrival INTEGER DEFAULT 0');
  tryAddCol('products', 'is_seasonal INTEGER DEFAULT 0');
  tryAddCol('products', 'tags TEXT');
  tryAddCol('products', 'notes TEXT');
  tryAddCol('products', 'is_archived INTEGER DEFAULT 0');

  tryAddCol('enquiries', 'occasion TEXT');
  tryAddCol('enquiries', 'priority TEXT DEFAULT "Normal"');
  tryAddCol('enquiries', 'source TEXT DEFAULT "Website"');
  tryAddCol('enquiries', 'is_archived INTEGER DEFAULT 0');
}

function seedCeremonies(db: Database) {
  const count = (db.exec("SELECT COUNT(*) FROM ceremonies;")[0]?.values[0][0] as number) || 0;
  if (count === 0) {
    db.run(`
      INSERT INTO ceremonies (ceremony_key, name_en, name_hi, hindi_aura, palette, description_en, description_hi, banner_tagline_en, banner_tagline_hi, image_url, sort_order, is_active)
      VALUES 
      ('haldi', 'HALDI CEREMONY', 'हल्दी सेरेमनी', 'पीत वर्ण अनुष्ठान एवं मांगलिक हल्दी रस्म', 'Sunlit Yellows, Gota Patti, Floral Silks', 'Joyous turmeric yellows, breezy mulmul, and light gota patti for intimate rituals.', 'शुभ पीत वर्ण के परिधान — गोटा पत्ती, हल्के मलमल व फ्लोरल वर्क।', 'Haldi Ceremony Special: Sunshine lehengas, sarees, suits, kurtis, gowns & kurtas.', 'हल्दी रस्म के लिए खास सुंदर पीताम्बरी लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन व कुर्ते।', '/src/assets/images/occasion_haldi_festive_1790325578682.jpg', 1, 1),
      ('mehendi', 'MEHENDI UTSAV', 'मेहंदी उत्सव', 'मरकत हरित, आभला दर्पण व उत्सव परिधान', 'Emerald Greens, Mirror Work, Fluid Georgette', 'Vibrant emerald greens and mirror embellishments crafted for effortless movement.', 'हरे व फिरोजी रंग के आरामदायक लहंगे, मिरर वर्क कुर्ते व फ्लोरल साड़ियाँ।', 'Mehendi Ceremony Special: Henna-friendly lehengas, sarees, suits, kurtis, gowns & kurtas.', 'मेहंदी रस्म के लिए खास हरे रंग के लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन व कुर्ते।', '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg', 2, 1),
      ('sangeet', 'SANGEET NIGHT', 'संगीत नाइट', 'नक्षत्र रात्रि — ३६०° ट्विर्ल व सीक्विन्स', 'Jewel Tones, Glittering Sequins, 360° Twirl', 'Glamorous twilight jewel hues with high-impact sparkle designed for the stage.', 'ग्लैमरस सीक्विन्स लहंगे, इंडो-वेस्टर्न बंदगला व कॉकटेल गाउन।', 'Sangeet Night Special: Glamorous lehengas, sarees, suits, kurtis, gowns & bandhgalas.', 'संगीत नाइट के लिए खास चमकदार लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन व बंदगला।', '/src/assets/images/groom_royal_sherwani_1790317453744.jpg', 3, 1),
      ('wedding', 'WEDDING / MANDAP', 'विवाह मंडप / फेरे', 'शाश्वत वैदिक फेरे व राजसी सिंदूरी परिधान', 'Heritage Crimson, Royal Zardozi, Pure Brocade', 'Heirloom vermilion reds, beaten gold zardozi, and regal raw silks for sacred vows.', 'शाश्वत राजपूताना लाल लहंगे, सिल्क शेरवानी व बनारसी कतान साड़ियाँ।', 'Mandap Vows Special: Sacred bridal lehengas, sarees, suits, kurtis, gowns & groom sherwanis.', 'शुभ विवाह फेरों के लिए राजसी दुल्हन लहंगा, बनारसी साड़ी, सूट, कुर्ती, गाउन व दूल्हा शेरवानी।', '/src/assets/images/hero_bridal_wedding_1790317438926.jpg', 4, 1),
      ('royal', 'ROYAL RECEPTION', 'रॉयल रिसेप्शन', 'शाही रिसेप्शन एवं आधुनिक भव्यता', 'Champagne Gold, Deep Wine, Velvet Bandhgalas', 'Contemporary grandeur, sculpted velvet silhouettes, and opulent champagne gold tones.', 'आधुनिक भव्यता — मखमली गाउन, जोधपुरी सूट व मेटैलिक साड़ियाँ।', 'Royal Reception Special: Grand lehengas, sarees, suits, kurtis, gowns, kurtas & bandhgalas.', 'रॉयल रिसेप्शन के लिए भव्य लहंगे, साड़ियाँ, सूट, कुर्ती, गाउन, कुर्ते व जोधपुरी बंदगला।', '/src/assets/images/family_wedding_ensemble_1790325566253.jpg', 5, 1),
      ('festival', 'FESTIVAL & PUJA', 'फेस्टिव व पूजन', 'मांगल्य एवं पारम्परिक देव पूजन संग्रह', 'Pure Banarasi Katan, Tussar, Chanderi Silks', 'Authentic master-woven Banarasi silk sarees, temple borders, and festive cottons.', 'असली हथकरघा साड़ियाँ, चंदेरी जरी बॉर्डर व पारम्परिक धोती कुर्ता।', 'Festival Special: Auspicious lehengas, sarees, suits, kurtis, gowns, kurtas & achkans.', 'दीपावली, करवाचौथ व पूजन हेतु हथकरघा साड़ियाँ, लहंगे, सूट, कुर्ती, गाउन व कुर्ते।', '/src/assets/images/designer_banarasi_saree_1790317467169.jpg', 6, 1);
    `);
  }
}

function ensureGroomProductsExist(db: Database) {
  const extraGroomProducts = [
    {
      catId: 3,
      subId: 11,
      name: 'Royal Heritage Velvet & Zardozi Groom Sherwani',
      name_hi: 'रॉयल हेरिटेज वेलवेट व जरदोजी दूल्हा शेरवानी',
      sku: 'SV-GR-202',
      desc: 'Royal groom sherwani crafted in rich deep maroon velvet with handcrafted antique zardozi work, royal buttons, coordinate stole, and churidar.',
      desc_hi: 'शाही वेलवेट पर जरदोजी वर्क, कटदाना और मरोड़ी कारीगरी से सजी भव्य दूल्हा शेरवानी। साफा व दुपट्टा सहित।',
      price: 42000,
      offer_price: 34999,
      colour: 'Royal Maroon & Antique Gold',
      size: '38, 40, 42, 44',
      fabric: 'Rich Micro Velvet & Silk',
      material: 'Handcrafted Zardozi, Cutdana & Antique Zari',
      is_featured: 1,
      images: JSON.stringify(['/src/assets/images/groom_royal_sherwani_1790317453744.jpg']),
      variants: [
        { sku: 'SV-GR-202-38', colour: 'Royal Maroon', size: '38', price: 34999, qty: 4 },
        { sku: 'SV-GR-202-40', colour: 'Royal Maroon', size: '40', price: 34999, qty: 5 },
        { sku: 'SV-GR-202-42', colour: 'Royal Maroon', size: '42', price: 34999, qty: 3 }
      ]
    },
    {
      catId: 3,
      subId: 11,
      name: 'Imperial Pearl White Jamawar Groom Sherwani',
      name_hi: 'इंपीरियल पर्ल व्हाइट जामावार दूल्हा शेरवानी',
      sku: 'SV-GR-203',
      desc: 'Regal pearl white Banarasi Jamawar weave sherwani with Swarovski crystal brooch, tonal resham embroidery, and bespoke stole for royal pheras.',
      desc_hi: 'मोती जैसी धवल जामावार वीव में सजी राजपूताना शेरवानी, क्रिस्टल ब्रूच व मैचिंग स्टोल सहित।',
      price: 38500,
      offer_price: 31999,
      colour: 'Pearl White & Platinum Zari',
      size: '38, 40, 42, 44',
      fabric: 'Banarasi Silk Jamawar',
      material: 'Tonal Resham Threadwork & Crystal Brooch',
      is_featured: 1,
      images: JSON.stringify(['/src/assets/images/groom_royal_sherwani_1790317453744.jpg']),
      variants: [
        { sku: 'SV-GR-203-38', colour: 'Pearl White', size: '38', price: 31999, qty: 3 },
        { sku: 'SV-GR-203-40', colour: 'Pearl White', size: '40', price: 31999, qty: 5 }
      ]
    },
    {
      catId: 3,
      subId: 10,
      name: 'Asymmetric Drape Indo Western Groom Ensemble',
      name_hi: 'असिमेट्रिक ड्रेप इंडो-वेस्टर्न ग्रूम सूट',
      sku: 'SV-INW-201',
      desc: 'Contemporary groom indo-western featuring an asymmetric pleated drape cut, hand-embellished geometric collar, and tailored cigarette trousers.',
      desc_hi: 'संगीत एवं कॉकटेल सेरेमनी के लिए स्टाइलिश असिमेट्रिक ड्रेप इंडो-वेस्टर्न परिधान, हैंड-एंब्रॉयडर्ड कॉलर सहित।',
      price: 28000,
      offer_price: 22999,
      colour: 'Midnight Navy & Metallic Gunmetal',
      size: '38, 40, 42, 44',
      fabric: 'Imported Suiting Blend & Georgette Drape',
      material: 'Geometric Cutdana, Hand-tucked Pleats & Metal Cufflinks',
      is_featured: 1,
      images: JSON.stringify(['/src/assets/images/groom_royal_sherwani_1790317453744.jpg']),
      variants: [
        { sku: 'SV-INW-201-38', colour: 'Midnight Navy', size: '38', price: 22999, qty: 4 },
        { sku: 'SV-INW-201-40', colour: 'Midnight Navy', size: '40', price: 22999, qty: 6 },
        { sku: 'SV-INW-201-42', colour: 'Midnight Navy', size: '42', price: 22999, qty: 3 }
      ]
    },
    {
      catId: 3,
      subId: 10,
      name: 'Rose Gold Silk Brocade Indo Western Achkan',
      name_hi: 'रोज़ गोल्ड सिल्क ब्रोकेड इंडो-वेस्टर्न अचकन',
      sku: 'SV-INW-202',
      desc: 'Modern fusion achkan crafted in metallic rose gold brocade with side-placket jewel buttons, ideal for evening reception and sangeet night.',
      desc_hi: 'सिल्क ब्रोकेड फैब्रिक में आधुनिक रोज़ गोल्ड इंडो-वेस्टर्न अचकन, ज्वेल बटन्स व सिगरेट पैंट्स के साथ।',
      price: 26500,
      offer_price: 21500,
      colour: 'Blush Rose Gold',
      size: '38, 40, 42, 44',
      fabric: 'Metallic Brocade Silk',
      material: 'Antique Jewel Placket & Structured Shoulders',
      is_featured: 0,
      images: JSON.stringify(['/src/assets/images/groom_royal_sherwani_1790317453744.jpg']),
      variants: [
        { sku: 'SV-INW-202-40', colour: 'Rose Gold', size: '40', price: 21500, qty: 5 },
        { sku: 'SV-INW-202-42', colour: 'Rose Gold', size: '42', price: 21500, qty: 4 }
      ]
    },
    {
      catId: 3,
      subId: 12,
      name: 'Royal Heritage Navy Jodhpuri Bandhgala Suit',
      name_hi: 'शाही हेरिटेज नेवी जोधपुरी बंदगला सूट',
      sku: 'SV-JDP-201',
      desc: 'Traditional high-neck royal Jodhpuri bandhgala crafted in pure Italian wool blend with antique crest buttons and bespoke tailored finish.',
      desc_hi: 'परंपरागत राजपूताना नेवी ब्लू जोधपुरी बंदगला सूट, इटैलियन वूल ब्लेंड फैब्रिक व शाही मेटल क्रेस्ट बटन्स के साथ।',
      price: 32000,
      offer_price: 26999,
      colour: 'Royal Navy Blue',
      size: '38, 40, 42, 44',
      fabric: 'Italian Wool Suiting Blend',
      material: 'Hand-cast Brass Royal Crest Buttons & Silk Pocket Square',
      is_featured: 1,
      images: JSON.stringify(['/src/assets/images/groom_royal_sherwani_1790317453744.jpg']),
      variants: [
        { sku: 'SV-JDP-201-38', colour: 'Royal Navy', size: '38', price: 26999, qty: 4 },
        { sku: 'SV-JDP-201-40', colour: 'Royal Navy', size: '40', price: 26999, qty: 5 },
        { sku: 'SV-JDP-201-42', colour: 'Royal Navy', size: '42', price: 26999, qty: 4 }
      ]
    },
    {
      catId: 3,
      subId: 9,
      name: 'Pista Green Silk Kurta with Floral Embroidered Bundi',
      name_hi: 'पिस्ता ग्रीन सिल्क कुर्ता व फ्लोरल बंडी जैकेट',
      sku: 'SV-KRT-201',
      desc: 'Refreshing pastel pista green dupion silk kurta complemented by an ivory silk Nehru bundi jacket with delicate multi-colour floral threadwork.',
      desc_hi: 'हल्दी व मेहंदी उत्सव के लिए पिस्ता ग्रीन सिल्क कुर्ता और हाथ से कढ़ाई की हुई फ्लोरल नेहरू बंडी जैकेट।',
      price: 11800,
      offer_price: 8999,
      colour: 'Pastel Pista Green & Ivory',
      size: '38, 40, 42, 44',
      fabric: 'Dupion Raw Silk & Tussar Silk',
      material: 'Floral Resham Threadwork & Threaded Potli Buttons',
      is_featured: 1,
      images: JSON.stringify(['/src/assets/images/groom_royal_sherwani_1790317453744.jpg']),
      variants: [
        { sku: 'SV-KRT-201-38', colour: 'Pista Green', size: '38', price: 8999, qty: 4 },
        { sku: 'SV-KRT-201-40', colour: 'Pista Green', size: '40', price: 8999, qty: 6 },
        { sku: 'SV-KRT-201-42', colour: 'Pista Green', size: '42', price: 8999, qty: 3 }
      ]
    }
  ];

  for (const prod of extraGroomProducts) {
    const checkStmt = db.prepare("SELECT id FROM products WHERE sku = :sku");
    checkStmt.bind({ ':sku': prod.sku });
    const exists = checkStmt.step();
    checkStmt.free();

    if (!exists) {
      db.run(`
        INSERT INTO products (category_id, subcategory_id, name, name_hi, sku, description, description_hi, price, offer_price, colour, size, fabric, material, is_featured, is_active, stock_status, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'In Stock', ?);
      `, [
        prod.catId,
        prod.subId,
        prod.name,
        prod.name_hi,
        prod.sku,
        prod.desc,
        prod.desc_hi,
        prod.price,
        prod.offer_price,
        prod.colour,
        prod.size,
        prod.fabric,
        prod.material,
        prod.is_featured,
        prod.images
      ]);

      const lastProdId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;
      for (const variant of prod.variants) {
        db.run(`
          INSERT INTO product_variants (product_id, sku, colour, size, price, offer_price, quantity, images)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `, [lastProdId, variant.sku, variant.colour, variant.size, variant.price, variant.price, variant.qty, prod.images]);
      }
    }
  }
}

function seedDefaultData(db: Database) {
  // Check if admin already exists
  const checkAdmin = db.exec("SELECT COUNT(*) as count FROM admins;");
  const count = checkAdmin[0]?.values[0]?.[0] as number;

  if (count === 0) {
    console.log('Seeding initial database with Shree Vijay Showroom data...');

    // Initial password requested by client: clothing9300
    // We securely hash it with bcrypt salt:
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('clothing9300', salt);

    db.run(`
      INSERT INTO admins (username, password_hash, role, name, phone, email)
      VALUES (?, ?, ?, ?, ?, ?);
    `, ['admin', passwordHash, 'SUPER ADMIN', 'Vijay Kumar', '08989892476', 'shreevijayshowroom@gmail.com']);

    // Roles
    db.run(`
      INSERT INTO roles (name, description, permissions) VALUES
      ('SUPER ADMIN', 'Full access to entire store and system', '["all"]'),
      ('MANAGER', 'Access to products, orders, enquiries, billing, customers, inventory', '["products","orders","enquiries","billing","customers","inventory"]'),
      ('SALES STAFF', 'Access to enquiries, customers, follow-ups, and orders', '["enquiries","customers","followups","orders"]'),
      ('INVENTORY STAFF', 'Access to products and inventory management', '["products","inventory"]');
    `);

    // Staff
    db.run(`
      INSERT INTO staff (name, phone, email, username, role, status) VALUES
      ('Rahul Verma', '09425112233', 'rahul@shreevijay.com', 'rahul_mgr', 'MANAGER', 'active'),
      ('Priya Sharma', '09827099887', 'priya@shreevijay.com', 'priya_sales', 'SALES STAFF', 'active'),
      ('Amit Jain', '09179544321', 'amit@shreevijay.com', 'amit_inv', 'INVENTORY STAFF', 'active');
    `);

    // Website Settings
    const defaultSettings: [string, string][] = [
      ['store_name', 'Shree Vijay Showroom'],
      ['store_name_hi', 'श्री विजय शोरूम'],
      ['tagline', 'The Best Saree, Lehenga, Sherwani & Wedding Store in Jabalpur'],
      ['tagline_hi', 'बेस्ट साड़ी | लहंगा | शेरवानी | वेडिंग स्टोर इन जबलपुर'],
      ['phone', '089898 92476'],
      ['whatsapp_number', '918989892476'],
      ['whatsapp_default_message', 'Hello Shree Vijay Showroom! I would like to enquire about your wedding collection.'],
      ['whatsapp_floating_enabled', 'true'],
      ['address', '26/1, Shree Vijay Showroom Infront of Jain Dairy Garha Phatak Road, Fuhara Rd, Bada, Jabalpur, Madhya Pradesh 482002'],
      ['address_hi', '२६/१, श्री विजय शोरूम, जैन डेयरी के सामने, गढ़ा फाटक रोड, फुहारा रोड, बड़ा फुहारा, जबलपुर, मध्य प्रदेश ४८२००२'],
      ['plus_code', '5WGJ+4G Jabalpur, Madhya Pradesh'],
      ['opening_hours', '10:30 AM – 10:00 PM (All 7 Days)'],
      ['opening_hours_hi', 'प्रातः १०:३० से रात्रि १०:०० बजे तक (सातों दिन खुला)'],
      ['rating', '4.8'],
      ['reviews_count', '987'],
      ['announcement_text', '✨ Welcome to Shree Vijay Showroom Jabalpur — Retail & Wholesale Wedding Specialist | Call 089898 92476 ✨'],
      ['announcement_text_hi', '✨ श्री विजय शोरूम जबलपुर में आपका स्वागत है — शादी की खरीदारी का विश्वसनीय नाम | कॉल करें: 089898 92476 ✨'],
      ['allow_negative_stock', 'false'],
      ['accent_color', '#B48448'],
      ['instagram_url', 'https://instagram.com/shreevijayshowroom'],
      ['facebook_url', 'https://facebook.com/shreevijayshowroom'],
      ['theme_style', 'royal-luxury']
    ];

    for (const [key, val] of defaultSettings) {
      db.run('INSERT INTO website_settings (key, value) VALUES (?, ?);', [key, val]);
    }

    // Social Links
    db.run(`
      INSERT INTO social_links (platform, url, is_enabled, extra_config) VALUES
      ('whatsapp', 'https://wa.me/918989892476', 1, '{"label":"Chat on WhatsApp"}'),
      ('instagram', 'https://instagram.com/shreevijayshowroom', 1, '{"label":"Follow on Instagram"}'),
      ('facebook', 'https://facebook.com/shreevijayshowroom', 1, '{"label":"Follow on Facebook"}'),
      ('google_maps', 'https://maps.google.com/?q=5WGJ%2B4G+Jabalpur', 1, '{"label":"Get Directions"}');
    `);

    // Website Sections
    db.run(`
      INSERT INTO website_sections (section_key, title_en, title_hi, subtitle_en, subtitle_hi, content_json, is_enabled, sort_order) VALUES
      ('hero', 'Timeless Grandeur for Your Most Sacred Celebrations', 'आपके शुभ विवाह और उत्सवों का राजसी वैभव', 'Jabalpur''s most trusted heritage wedding showroom. Exquisite Bridal Lehengas, Royal Groom Sherwanis, Pure Silk Sarees, and Family Ethnic Ensembles in every price range.', 'जबलपुर का सबसे प्रतिष्ठित वेडिंग स्टोर - दुल्हन लहंगा, दूल्हा शेरवानी, सिल्क साड़ियाँ और सम्पूर्ण फैमिली एथनिक कलेक्शन।', '{}', 1, 1),
      ('collections', 'Curated Wedding Collections', 'विवाह एवं उत्सव संग्रह', 'Handcrafted masterworks designed for Haldi, Mehendi, Sangeet, Wedding, and Grand Reception.', 'हल्दी, मेहंदी, संगीत से लेकर शुभ विवाह और रिसेप्शन के लिए खास परिधान।', '{}', 1, 2),
      ('craft_story', 'Pure Fabric & Heritage Craftsmanship', 'शुद्ध फैब्रिक व शिल्प की विश्वसनीयता', 'Celebrating generations of textile legacy in the heart of Jabalpur with authentic pure cotton, Banarasi brocades, and zardozi artistry.', 'शुद्ध कॉटन, असली बनारसी जरी और प्रामाणिक कारीगरी की अनूठी परंपरा।', '{}', 1, 3),
      ('reviews', 'Trusted by 987+ Happy Families', '९८७+ संतुष्ट परिवारों का सच्चा विश्वास', 'Rated 4.8 on Google for exceptional quality, bespoke fittings, and warm hospitality.', 'गूगल पर ४.८ स्टार रेटिंग — उत्तम गुणवत्ता और संपूर्ण संतुष्टि।', '{}', 1, 4),
      ('instagram', 'Showroom Moments & Trending Ensembles', 'शोरूम की झलकियां व ट्रेंडिंग फैशन', 'Explore our latest arrivals and real bridal transformations on Instagram.', 'इंस्टाग्राम पर हमारे नए डिजाइन और दुल्हन श्रृंगार की झलक देखें।', '{}', 1, 5),
      ('contact', 'Visit Our Jabalpur Showroom', 'हमारे शोरूम पधारें', 'Experience royal hospitality at Bada Fuhara, Garha Phatak Road.', 'बड़ा फुहारा, गढ़ा फाटक रोड स्थित हमारे विशाल शोरूम में आपका स्वागत है।', '{}', 1, 6);
    `);

    // Categories
    db.run(`
      INSERT INTO categories (name, name_hi, slug, description, description_hi, image_url, sort_order, is_active) VALUES
      ('Bridal Lehengas', 'दुल्हन लहंगा', 'bridal-lehengas', 'Heirloom zardozi, velvet, and raw silk lehengas for the modern royal bride.', 'शाही जरी, जरदोजी व वेलवेट में सजे अलौकिक दुल्हन लहंगे।', '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg', 1, 1),
      ('Designer Sarees', 'डिज़ाइनर साड़ियाँ', 'designer-sarees', 'Pure Banarasi, Kanjivaram, Chanderi, Organza, and festive party-wear sarees.', 'विशुद्ध बनारसी, कांजीवरम, चंदेरी और पार्टी वियर साड़ियाँ।', '/src/assets/images/designer_banarasi_saree_1790317467169.jpg', 2, 1),
      ('Groom Sherwanis & Menswear', 'दूल्हा शेरवानी व मेन्सवियर', 'groom-sherwanis', 'Regal handcrafted sherwanis, Indo-western bandhgalas, and designer kurta sets.', 'राजपूताना व जोधपुरी शेरवानी, इंडो-वेस्टर्न और डिजाइनर कुर्ते।', '/src/assets/images/groom_royal_sherwani_1790317453744.jpg', 3, 1),
      ('Pure Cotton Sarees', 'शुद्ध कॉटन साड़ी', 'pure-cotton-sarees', 'Authentic breathable pure cotton sarees trusted for generations in Jabalpur.', 'जबलपुर का सबसे भरोसेमंद १००% शुद्ध कॉटन साड़ी कलेक्शन।', '/src/assets/images/designer_banarasi_saree_1790317467169.jpg', 4, 1),
      ('Salwar Suits & Anarkali', 'सलवार सूट एवं अनारकली', 'salwar-suits', 'Designer party suits, Pakistani cuts, and flared bridal anarkalis.', 'पार्टी वियर रेडीमेड एवं अनस्टिच्ड डिज़ाइनर सलवार सूट्स।', '/src/assets/images/hero_bridal_wedding_1790317438926.jpg', 5, 1),
      ('Family & Festive Wear', 'फैमिली एवं फेस्टिव वियर', 'family-festive-wear', 'Coordinated ensembles for the entire wedding party, Haldi, and Sangeet.', 'हल्दी, मेहंदी एवं पूरे परिवार के लिए मैचिंग फेस्टिव परिधान।', '/src/assets/images/showroom_interior_ambiance_1790317495781.jpg', 6, 1);
    `);

    // Subcategories
    db.run(`
      INSERT INTO subcategories (category_id, name, name_hi, slug) VALUES
      (1, 'Haldi Lehengas', 'हल्दी लहंगा', 'haldi-lehengas'),
      (1, 'Sangeet & Mehendi Lehengas', 'संगीत एवं मेहंदी लहंगा', 'sangeet-lehengas'),
      (1, 'Mandap & Phera Bridal Lehengas', 'मंडप एवं फेरा दुल्हन लहंगा', 'mandap-lehengas'),
      (1, 'Royal Reception Lehengas', 'शाही रिसेप्शन लहंगा', 'reception-lehengas'),
      (2, 'Haldi & Yellow Silk Sarees', 'हल्दी व फेस्टिव सिल्क साड़ियाँ', 'haldi-sarees'),
      (2, 'Pure Banarasi Katan Silk', 'शुद्ध बनारसी कतान सिल्क', 'pure-banarasi-silk'),
      (2, 'Mandap & Wedding Silk Sarees', 'मंडप व विवाह सिल्क साड़ियाँ', 'mandap-wedding-sarees'),
      (2, 'Reception Party-Wear & Organza', 'रिसेप्शन पार्टी वियर व ऑर्गेंजा', 'reception-party-sarees'),
      (3, 'Haldi Kurta & Bundi Jacket', 'हल्दी कुर्ता व बंडी जैकेट', 'haldi-kurta-mens'),
      (3, 'Sangeet Indo-Western & Jodhpuri', 'संगीत इंडो-वेस्टर्न व जोधपुरी', 'sangeet-mens'),
      (3, 'Mandap Royal Sherwani & Safa', 'मंडप राजसी शेरवानी व साफा', 'mandap-sherwani'),
      (3, 'Reception Bandhgala & Tuxedo', 'रिसेप्शन बंदगला व सूट', 'reception-bandhgala'),
      (4, 'Handspun Mulmul Cotton', 'हाथ से बुनी मलमल कॉटन', 'mulmul-cotton'),
      (4, 'Chanderi Zari Border Cotton', 'चंदेरी जरी बॉर्डर कॉटन', 'chanderi-cotton'),
      (4, 'Daily & Temple Cotton Sarees', 'डेली व टेम्पल कॉटन साड़ियाँ', 'temple-cotton'),
      (5, 'Haldi Sharara & Gharara Suits', 'हल्दी शरारा व गरारा', 'haldi-sharara'),
      (5, 'Sangeet Flared Anarkali', 'संगीत अनारकली सूट', 'sangeet-anarkali'),
      (5, 'Wedding Heavy Pakistani Suits', 'वेडिंग हेवी पाकिस्तानी सूट', 'wedding-pakistani-suits'),
      (5, 'Reception Designer Gowns', 'रिसेप्शन डिज़ाइनर गाउन', 'reception-gowns'),
      (6, 'Haldi Co-ordinated Yellow Theme', 'हल्दी मैचिंग फैमिली थीम', 'haldi-family-wear'),
      (6, 'Sangeet Matching Ensembles', 'संगीत मैचिंग फैमिली पोशाक', 'sangeet-family-wear'),
      (6, 'Mandap & Wedding Royal Family Attire', 'मंडप व विवाह राजसी फैमिली परिधान', 'wedding-family-wear'),
      (6, 'Reception Evening Partywear', 'रिसेप्शन इवनिंग पार्टीवियर', 'reception-family-wear');
    `);

    // Products
    const productsData = [
      {
        catId: 1,
        subId: 1,
        name: 'Rajwada Crimson Zardozi Bridal Lehenga',
        name_hi: 'रजवाड़ा क्रिमसन जरदोजी दुल्हन लहंगा',
        sku: 'SV-BR-001',
        desc: 'Intricately hand-embroidered royal red bridal lehenga crafted with real gold-plated zardozi, dabka, and pearl work on rich velvet silk. Comes with dual dupattas (heavy velvet bridal veil + sheer organza head drape).',
        desc_hi: 'शाही लाल वेलवेट सिल्क पर शुद्ध स्वर्ण जरी, दबका और मोती के हाथ की कारीगरी से सजा दुल्हन लहंगा। साथ में दो दुपट्टे (वेलवेट घूंघट और ऑर्गेंजा दुपट्टा)।',
        price: 58500,
        offer_price: 49999,
        colour: 'Royal Crimson Red',
        size: 'Semi-Stitched (Customizable up to 44)',
        fabric: 'Micro Velvet & Silk Blend',
        material: 'Handcrafted Zardozi, Sequins & Pearls',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/hero_bridal_wedding_1790317438926.jpg',
          '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg'
        ]),
        variants: [
          { sku: 'SV-BR-001-RED', colour: 'Royal Crimson Red', size: 'Semi-Stitched', price: 49999, qty: 5 },
          { sku: 'SV-BR-001-MAR', colour: 'Deep Wine Maroon', size: 'Semi-Stitched', price: 49999, qty: 3 }
        ]
      },
      {
        catId: 1,
        subId: 2,
        name: 'Gulabi Mehrunissa Pastel Rose Gold Lehenga',
        name_hi: 'गुलाबी मेहरुन्निसा पेस्टल रोज़ गोल्ड लहंगा',
        sku: 'SV-BR-002',
        desc: 'Ethereal blush rose gold bridal lehenga adorned with French knots, crystal tassels, and mirror foliage. Designed for modern day-wedding pheras and reception ceremonies.',
        desc_hi: 'हल्के गुलाबी और रोज़ गोल्ड शेड में आधुनिक दुल्हन लहंगा, जिसमें फ्रेंच नॉट और क्रिस्टल का मनमोहक वर्क है।',
        price: 46000,
        offer_price: 39500,
        colour: 'Blush Rose Gold',
        size: 'Custom Fit Available',
        fabric: 'Italian Net & Organza',
        material: 'Cutdana, Swarowski Crystals, Mirror Work',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg',
          '/src/assets/images/hero_bridal_wedding_1790317438926.jpg'
        ]),
        variants: [
          { sku: 'SV-BR-002-BLUSH', colour: 'Blush Pink', size: 'Semi-Stitched', price: 39500, qty: 4 },
          { sku: 'SV-BR-002-CHAMP', colour: 'Champagne Gold', size: 'Semi-Stitched', price: 39500, qty: 4 }
        ]
      },
      {
        catId: 2,
        subId: 4,
        name: 'Kashi Heritage Emerald Green Banarasi Katan Silk Saree',
        name_hi: 'काशी हेरिटेज एमराल्ड ग्रीन बनारसी कतान सिल्क साड़ी',
        sku: 'SV-SR-101',
        desc: 'Original pure Katan silk saree woven in Varanasi using antique gold zari kadwa motifs with meenakari details. Includes rich heavy brocade unstitched blouse piece.',
        desc_hi: 'शुद्ध कतान सिल्क पर प्राचीन स्वर्ण जरी और मीनाकारी बूटों से बुनी प्रामाणिक बनारसी साड़ी। भव्य पल्लू और मैचिंग ब्रोकेड ब्लाउज सहित।',
        price: 18500,
        offer_price: 14900,
        colour: 'Royal Emerald Green & Gold',
        size: '6.3 Meters (With Blouse)',
        fabric: '100% Pure Katan Silk',
        material: 'Real Gold Zari Kadwa Weave',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/designer_banarasi_saree_1790317467169.jpg'
        ]),
        variants: [
          { sku: 'SV-SR-101-GRN', colour: 'Emerald Green', size: '6.3 M', price: 14900, qty: 8 },
          { sku: 'SV-SR-101-RED', colour: 'Vermilion Red', size: '6.3 M', price: 14900, qty: 6 },
          { sku: 'SV-SR-101-PUR', colour: 'Royal Purple', size: '6.3 M', price: 14900, qty: 4 }
        ]
      },
      {
        catId: 3,
        subId: 7,
        name: 'Maharaja Ivory & Muted Gold Raw Silk Sherwani',
        name_hi: 'महाराजा आइवरी व म्यूटेड गोल्ड रॉ सिल्क शेरवानी',
        sku: 'SV-GR-201',
        desc: 'Aristocratic groom sherwani crafted in luxurious ivory raw silk featuring hand-embroidered resham and marodi work. Paired with churidar, silk stole, and custom turban brooch.',
        desc_hi: 'रॉ सिल्क पर हाथ की रेशम व मरोड़ी कढ़ाई से सुसज्जित दूल्हा शेरवानी। साथ में चूड़ीदार, जरी स्टोल और साफा।',
        price: 36000,
        offer_price: 28999,
        colour: 'Ivory & Antique Gold',
        size: '38, 40, 42, 44',
        fabric: 'Pure Raw Silk',
        material: 'Hand Resham, Mokaish & Antique Zari',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-GR-201-38', colour: 'Ivory Gold', size: '38', price: 28999, qty: 3 },
          { sku: 'SV-GR-201-40', colour: 'Ivory Gold', size: '40', price: 28999, qty: 5 },
          { sku: 'SV-GR-201-42', colour: 'Ivory Gold', size: '42', price: 28999, qty: 4 }
        ]
      },
      {
        catId: 4,
        subId: 10,
        name: 'Narmada Classic Pure Cotton Temple Border Saree',
        name_hi: 'नर्मदा क्लासिक शुद्ध कॉटन टेम्पल बॉर्डर साड़ी',
        sku: 'SV-CT-301',
        desc: 'Our flagship 100% pure combed cotton saree with woven temple border. Unmatched softness and durability praised by Jabalpur families for daily elegance and summer poojas.',
        desc_hi: '१००% शुद्ध कॉटन से बनी प्रामाणिक साड़ी जिसमें पारंपरिक मंदिर बॉर्डर है। अत्यधिक आरामदायक एवं लंबे समय तक चलने वाला फैब्रिक।',
        price: 2400,
        offer_price: 1850,
        colour: 'Indigo Blue & Mustard',
        size: '5.5 Meters',
        fabric: '100% Combed Cotton',
        material: 'Handloom Cotton Thread Weave',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/designer_banarasi_saree_1790317467169.jpg'
        ]),
        variants: [
          { sku: 'SV-CT-301-BLU', colour: 'Indigo Blue', size: '5.5 M', price: 1850, qty: 15 },
          { sku: 'SV-CT-301-MRN', colour: 'Rust Maroon', size: '5.5 M', price: 1850, qty: 12 },
          { sku: 'SV-CT-301-YEL', colour: 'Mustard Yellow', size: '5.5 M', price: 1850, qty: 2 }
        ]
      },
      {
        catId: 5,
        subId: 6,
        name: 'Noorani Georgette Mirror Work Party Suit',
        name_hi: 'नूरानी जॉर्जेट मिरर वर्क पार्टी सूट',
        sku: 'SV-ST-401',
        desc: 'Flared designer suit in flowy georgette with genuine mirror embellishments and gota patti hem. Paired with santoon pants and embroidered dupatta.',
        desc_hi: 'फ्लोई जॉर्जेट फैब्रिक में असली आभला (मिरर) और गोटा पट्टी वर्क वाला खूबसूरत अनारकली सूट।',
        price: 7800,
        offer_price: 5999,
        colour: 'Dusty Peach',
        size: 'M, L, XL, XXL',
        fabric: 'Pure Georgette',
        material: 'Mirror Work & Gota Border',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/hero_bridal_wedding_1790317438926.jpg'
        ]),
        variants: [
          { sku: 'SV-ST-401-M', colour: 'Peach', size: 'M', price: 5999, qty: 6 },
          { sku: 'SV-ST-401-L', colour: 'Peach', size: 'L', price: 5999, qty: 5 },
          { sku: 'SV-ST-401-XL', colour: 'Peach', size: 'XL', price: 5999, qty: 1 }
        ]
      },
      {
        catId: 1,
        subId: 1,
        name: 'Basanti Gota-Patti Sunshine Organza Lehenga',
        name_hi: 'वासंती गोटा-पत्ती सनशाइन ऑर्गेंजा लहंगा',
        sku: 'SV-HLD-001',
        desc: 'Vibrant sunshine yellow bridal lehenga designed with authentic floral gota-patti borders, mirror tassels, and lightweight organza drape crafted specifically for joyful haldi and pithi rituals.',
        desc_hi: 'शुभ पीत वर्ण में प्रामाणिक गोटा-पत्ती बॉर्डर और हल्के ऑर्गेंजा दुपट्टे से सुसज्जित हल्दी सेरेमनी लहंगा।',
        price: 26000,
        offer_price: 21999,
        colour: 'Sunlit Turmeric Yellow',
        size: 'Semi-Stitched (Custom Fit)',
        fabric: 'Pure Organza & Silk',
        material: 'Gota Patti, Mirror Tassels & Resham Embroidery',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/occasion_haldi_festive_1790325578682.jpg'
        ]),
        variants: [
          { sku: 'SV-HLD-001-YEL', colour: 'Turmeric Yellow', size: 'Semi-Stitched', price: 21999, qty: 6 }
        ]
      },
      {
        catId: 5,
        subId: 16,
        name: 'Kashmiri Floral Chiffon Sharara Suit',
        name_hi: 'कश्मीरी फ्लोरल शिफॉन शरारा सूट',
        sku: 'SV-HLD-002',
        desc: 'Easy-to-wear flared haldi sharara suit with mirror work yoke, cutdana details, and breathable fabric ideal for turmeric application and family blessings.',
        desc_hi: 'हल्दी रस्म के लिए अत्यंत आरामदायक फ्लोरल शरारा सूट जिसमें आभला मिरर और कटदाना वर्क है।',
        price: 11500,
        offer_price: 8999,
        colour: 'Mustard Yellow',
        size: 'M, L, XL',
        fabric: 'Pure Georgette & Chiffon',
        material: 'Cutdana, Mirror Work & Gota Hem',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/occasion_haldi_festive_1790325578682.jpg'
        ]),
        variants: [
          { sku: 'SV-HLD-002-M', colour: 'Mustard', size: 'M', price: 8999, qty: 5 },
          { sku: 'SV-HLD-002-L', colour: 'Mustard', size: 'L', price: 8999, qty: 4 }
        ]
      },
      {
        catId: 2,
        subId: 5,
        name: 'Marigold Chanderi Silk Zari Saree',
        name_hi: 'मैरीगोल्ड चंदेरी सिल्क जरी साड़ी',
        sku: 'SV-HLD-003',
        desc: 'Handcrafted yellow Chanderi silk saree featuring delicate golden zari bootis and contrasting auspicious vermilion temple border.',
        desc_hi: 'हाथ से बुनी शुभ पीली चंदेरी सिल्क साड़ी जिसमें सुनहरी जरी बूटियाँ और लाल किनारी है।',
        price: 8800,
        offer_price: 6499,
        colour: 'Marigold Gold',
        size: '6.3 Meters',
        fabric: 'Pure Chanderi Silk',
        material: 'Handwoven Golden Zari Bootis',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/designer_banarasi_saree_1790317467169.jpg'
        ]),
        variants: [
          { sku: 'SV-HLD-003-YEL', colour: 'Marigold', size: '6.3 M', price: 6499, qty: 8 }
        ]
      },
      {
        catId: 3,
        subId: 11,
        name: 'Royal Heritage Velvet & Zardozi Groom Sherwani',
        name_hi: 'रॉयल हेरिटेज वेलवेट व जरदोजी दूल्हा शेरवानी',
        sku: 'SV-GR-202',
        desc: 'Royal groom sherwani crafted in rich deep maroon velvet with handcrafted antique zardozi work, royal buttons, coordinate stole, and churidar.',
        desc_hi: 'शाही वेलवेट पर जरदोजी वर्क, कटदाना और मरोड़ी कारीगरी से सजी भव्य दूल्हा शेरवानी। साफा व दुपट्टा सहित।',
        price: 42000,
        offer_price: 34999,
        colour: 'Royal Maroon & Antique Gold',
        size: '38, 40, 42, 44',
        fabric: 'Rich Micro Velvet & Silk',
        material: 'Handcrafted Zardozi, Cutdana & Antique Zari',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-GR-202-38', colour: 'Royal Maroon', size: '38', price: 34999, qty: 4 },
          { sku: 'SV-GR-202-40', colour: 'Royal Maroon', size: '40', price: 34999, qty: 5 },
          { sku: 'SV-GR-202-42', colour: 'Royal Maroon', size: '42', price: 34999, qty: 3 }
        ]
      },
      {
        catId: 3,
        subId: 11,
        name: 'Imperial Pearl White Jamawar Groom Sherwani',
        name_hi: 'इंपीरियल पर्ल व्हाइट जामावार दूल्हा शेरवानी',
        sku: 'SV-GR-203',
        desc: 'Regal pearl white Banarasi Jamawar weave sherwani with Swarovski crystal brooch, tonal resham embroidery, and bespoke stole for royal pheras.',
        desc_hi: 'मोती जैसी धवल जामावार वीव में सजी राजपूताना शेरवानी, क्रिस्टल ब्रूच व मैचिंग स्टोल सहित।',
        price: 38500,
        offer_price: 31999,
        colour: 'Pearl White & Platinum Zari',
        size: '38, 40, 42, 44',
        fabric: 'Banarasi Silk Jamawar',
        material: 'Tonal Resham Threadwork & Crystal Brooch',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-GR-203-38', colour: 'Pearl White', size: '38', price: 31999, qty: 3 },
          { sku: 'SV-GR-203-40', colour: 'Pearl White', size: '40', price: 31999, qty: 5 }
        ]
      },
      {
        catId: 3,
        subId: 10,
        name: 'Asymmetric Drape Indo Western Groom Ensemble',
        name_hi: 'असिमेट्रिक ड्रेप इंडो-वेस्टर्न ग्रूम सूट',
        sku: 'SV-INW-201',
        desc: 'Contemporary groom indo-western featuring an asymmetric pleated drape cut, hand-embellished geometric collar, and tailored cigarette trousers.',
        desc_hi: 'संगीत एवं कॉकटेल सेरेमनी के लिए स्टाइलिश असिमेट्रिक ड्रेप इंडो-वेस्टर्न परिधान, हैंड-एंब्रॉयडर्ड कॉलर सहित।',
        price: 28000,
        offer_price: 22999,
        colour: 'Midnight Navy & Metallic Gunmetal',
        size: '38, 40, 42, 44',
        fabric: 'Imported Suiting Blend & Georgette Drape',
        material: 'Geometric Cutdana, Hand-tucked Pleats & Metal Cufflinks',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-INW-201-38', colour: 'Midnight Navy', size: '38', price: 22999, qty: 4 },
          { sku: 'SV-INW-201-40', colour: 'Midnight Navy', size: '40', price: 22999, qty: 6 },
          { sku: 'SV-INW-201-42', colour: 'Midnight Navy', size: '42', price: 22999, qty: 3 }
        ]
      },
      {
        catId: 3,
        subId: 10,
        name: 'Rose Gold Silk Brocade Indo Western Achkan',
        name_hi: 'रोज़ गोल्ड सिल्क ब्रोकेड इंडो-वेस्टर्न अचकन',
        sku: 'SV-INW-202',
        desc: 'Modern fusion achkan crafted in metallic rose gold brocade with side-placket jewel buttons, ideal for evening reception and sangeet night.',
        desc_hi: 'सिल्क ब्रोकेड फैब्रिक में आधुनिक रोज़ गोल्ड इंडो-वेस्टर्न अचकन, ज्वेल बटन्स व सिगरेट पैंट्स के साथ।',
        price: 26500,
        offer_price: 21500,
        colour: 'Blush Rose Gold',
        size: '38, 40, 42, 44',
        fabric: 'Metallic Brocade Silk',
        material: 'Antique Jewel Placket & Structured Shoulders',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-INW-202-40', colour: 'Rose Gold', size: '40', price: 21500, qty: 5 },
          { sku: 'SV-INW-202-42', colour: 'Rose Gold', size: '42', price: 21500, qty: 4 }
        ]
      },
      {
        catId: 3,
        subId: 12,
        name: 'Royal Heritage Navy Jodhpuri Bandhgala Suit',
        name_hi: 'शाही हेरिटेज नेवी जोधपुरी बंदगला सूट',
        sku: 'SV-JDP-201',
        desc: 'Traditional high-neck royal Jodhpuri bandhgala crafted in pure Italian wool blend with antique crest buttons and bespoke tailored finish.',
        desc_hi: 'परंपरागत राजपूताना नेवी ब्लू जोधपुरी बंदगला सूट, इटैलियन वूल ब्लेंड फैब्रिक व शाही मेटल क्रेस्ट बटन्स के साथ।',
        price: 32000,
        offer_price: 26999,
        colour: 'Royal Navy Blue',
        size: '38, 40, 42, 44',
        fabric: 'Italian Wool Suiting Blend',
        material: 'Hand-cast Brass Royal Crest Buttons & Silk Pocket Square',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-JDP-201-38', colour: 'Royal Navy', size: '38', price: 26999, qty: 4 },
          { sku: 'SV-JDP-201-40', colour: 'Royal Navy', size: '40', price: 26999, qty: 5 },
          { sku: 'SV-JDP-201-42', colour: 'Royal Navy', size: '42', price: 26999, qty: 4 }
        ]
      },
      {
        catId: 3,
        subId: 9,
        name: 'Pista Green Silk Kurta with Floral Embroidered Bundi',
        name_hi: 'पिस्ता ग्रीन सिल्क कुर्ता व फ्लोरल बंडी जैकेट',
        sku: 'SV-KRT-201',
        desc: 'Refreshing pastel pista green dupion silk kurta complemented by an ivory silk Nehru bundi jacket with delicate multi-colour floral threadwork.',
        desc_hi: 'हल्दी व मेहंदी उत्सव के लिए पिस्ता ग्रीन सिल्क कुर्ता और हाथ से कढ़ाई की हुई फ्लोरल नेहरू बंडी जैकेट।',
        price: 11800,
        offer_price: 8999,
        colour: 'Pastel Pista Green & Ivory',
        size: '38, 40, 42, 44',
        fabric: 'Dupion Raw Silk & Tussar Silk',
        material: 'Floral Resham Threadwork & Threaded Potli Buttons',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-KRT-201-38', colour: 'Pista Green', size: '38', price: 8999, qty: 4 },
          { sku: 'SV-KRT-201-40', colour: 'Pista Green', size: '40', price: 8999, qty: 6 },
          { sku: 'SV-KRT-201-42', colour: 'Pista Green', size: '42', price: 8999, qty: 3 }
        ]
      },
      {
        catId: 3,
        subId: 9,
        name: 'Maharaja Mustard Raw Silk Kurta & Bundi Jacket',
        name_hi: 'महाराजा मस्टर्ड रॉ सिल्क कुर्ता व बंडी',
        sku: 'SV-HLD-004',
        desc: 'Groom and brother-of-bride festive raw silk yellow kurta paired with an embroidered Nehru bundi jacket and churidar.',
        desc_hi: 'रॉ सिल्क में दूल्हे व भाइयों के लिए हल्दी स्पेशल पीला कुर्ता और हाथ की कढ़ाई वाली बंडी जैकेट।',
        price: 10500,
        offer_price: 7999,
        colour: 'Mustard & Cream',
        size: '38, 40, 42, 44',
        fabric: 'Dupion Raw Silk',
        material: 'Resham Threadwork & Brass Buttons',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-HLD-004-38', colour: 'Mustard', size: '38', price: 7999, qty: 4 },
          { sku: 'SV-HLD-004-40', colour: 'Mustard', size: '40', price: 7999, qty: 5 }
        ]
      },
      {
        catId: 1,
        subId: 2,
        name: 'Emerald Mehendi Mirror Flare Lehenga',
        name_hi: 'एमराल्ड मेहंदी मिरर फ्लेयर लहंगा',
        sku: 'SV-MHD-001',
        desc: 'Striking emerald green lehenga crafted with shimmering mirror medallions and comfortable sleeveless blouse for easy henna application.',
        desc_hi: 'गहरे हरे रंग में आभला मिरर और रेशम फ्लोरल वर्क से सजा मेहंदी उत्सव लहंगा।',
        price: 38000,
        offer_price: 32500,
        colour: 'Emerald Henna Green',
        size: 'Semi-Stitched',
        fabric: 'Pure Georgette & Raw Silk',
        material: 'Genuine Mirror Work & Resham Embroidery',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg'
        ]),
        variants: [
          { sku: 'SV-MHD-001-GRN', colour: 'Emerald Green', size: 'Semi-Stitched', price: 32500, qty: 5 }
        ]
      },
      {
        catId: 2,
        subId: 8,
        name: 'Mint Sage Floral Hand-Embroidered Organza Saree',
        name_hi: 'मिंट सेज फ्लोरल ऑर्गेंजा साड़ी',
        sku: 'SV-MHD-002',
        desc: 'Breezy pastel green organza saree with delicate hand-embroidered botanical motifs and shimmering scalloped borders.',
        desc_hi: 'हल्के मिंट ग्रीन रंग में पारदर्शी ऑर्गेंजा साड़ी जिसमें फूलों की महीन कढ़ाई और स्कैलप्ड बॉर्डर है।',
        price: 15500,
        offer_price: 12200,
        colour: 'Mint Sage Green',
        size: '6.3 Meters',
        fabric: 'Translucent Organza Silk',
        material: 'Hand-painted Florals & Scalloped Zari Edge',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/designer_banarasi_saree_1790317467169.jpg'
        ]),
        variants: [
          { sku: 'SV-MHD-002-GRN', colour: 'Mint Green', size: '6.3 M', price: 12200, qty: 6 }
        ]
      },
      {
        catId: 1,
        subId: 2,
        name: 'Midnight Twilight 360° Twirl Sequin Lehenga',
        name_hi: 'मिडनाइट 360° ट्विर्ल सीक्विन्स संगीत लहंगा',
        sku: 'SV-SNG-001',
        desc: 'High-octane glamour lehenga designed for stage performances, featuring an expansive 360-degree flare that creates magical reflections under lights.',
        desc_hi: 'संगीत नाइट के लिए ३६० डिग्री घेरे वाला नेवी ब्लू सीक्विन्स लहंगा, डांस के लिए परफेक्ट।',
        price: 48000,
        offer_price: 41500,
        colour: 'Midnight Navy Blue',
        size: 'Semi-Stitched',
        fabric: 'Italian Shimmer Net & Silk',
        material: 'Reflective Micro-Cut Dual Tone Sequins',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/bridal_lehenga_collection_1790317477737.jpg'
        ]),
        variants: [
          { sku: 'SV-SNG-001-BLU', colour: 'Midnight Blue', size: 'Semi-Stitched', price: 41500, qty: 4 }
        ]
      },
      {
        catId: 3,
        subId: 10,
        name: 'Royal Wine Velvet Bandhgala Tuxedo',
        name_hi: 'रॉयल वाइन वेलवेट संगीत बंदगला',
        sku: 'SV-SNG-002',
        desc: 'Impeccably tailored men evening bandhgala jacket with structured shoulders and tapered trousers for sangeet and cocktail ceremonies.',
        desc_hi: 'मखमली वाइन रंग में राजसी बंदगला जोधपुरी सूट, संगीत और कॉकटेल पार्टी के लिए उपयुक्त।',
        price: 31000,
        offer_price: 24999,
        colour: 'Deep Wine Plum',
        size: '38, 40, 42, 44',
        fabric: 'Imported Micro Velvet',
        material: 'Hand-cast Crest Buttons & Metallic Trim',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-SNG-002-38', colour: 'Deep Wine', size: '38', price: 24999, qty: 3 },
          { sku: 'SV-SNG-002-40', colour: 'Deep Wine', size: '40', price: 24999, qty: 4 }
        ]
      },
      {
        catId: 5,
        subId: 19,
        name: 'Champagne Gold Swarovski Sculpted Reception Gown',
        name_hi: 'शैम्पेन गोल्ड स्वारोवस्की रिसेप्शन गाउन',
        sku: 'SV-RCP-001',
        desc: 'Grand reception ballgown featuring a dramatic sweep trail, encrusted with crystals and cutdana for opulent evening celebrations.',
        desc_hi: 'भव्य रिसेप्शन गाउन जिसमें स्वारोवस्की क्रिस्टल्स और शानदार ट्रेल है।',
        price: 48000,
        offer_price: 42500,
        colour: 'Champagne Gold',
        size: 'Custom Fit (S, M, L)',
        fabric: 'Sculpted Tulle & Duchess Satin',
        material: 'Swarovski Crystals, Cutdana & Glass Beads',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/family_wedding_ensemble_1790325566253.jpg'
        ]),
        variants: [
          { sku: 'SV-RCP-001-GLD', colour: 'Champagne Gold', size: 'Custom Fit', price: 42500, qty: 3 }
        ]
      },
      {
        catId: 3,
        subId: 12,
        name: 'Obsidian Velvet Handcrafted Jodhpuri Bandhgala',
        name_hi: 'ऑब्सिडियन वेलवेट जोधपुरी बंदगला',
        sku: 'SV-RCP-002',
        desc: 'Bespoke handcrafted black velvet Jodhpuri bandhgala coat with tone-on-tone silk threadwork and tapered trousers.',
        desc_hi: 'काले मखमली फैब्रिक पर सिल्क थ्रेड की हाथ की नक्काशी वाला रिसेप्शन जोधपुरी सूट।',
        price: 35000,
        offer_price: 29999,
        colour: 'Obsidian Black',
        size: '38, 40, 42, 44',
        fabric: 'Royal Micro Velvet',
        material: 'Monochrome Silk Hand Embroidery',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-RCP-002-BLK', colour: 'Obsidian Black', size: '40', price: 29999, qty: 4 }
        ]
      },
      {
        catId: 2,
        subId: 6,
        name: 'Padmavati Shikargah Pure Katan Silk Saree',
        name_hi: 'पद्मावती शिकारगाह शुद्ध कतान सिल्क साड़ी',
        sku: 'SV-FST-001',
        desc: 'Museum-grade Varanasi handloom masterpiece showcasing antique Shikargah hunting motifs and floral jaal woven in gold zari for auspicious pujas and festivals.',
        desc_hi: 'बनारस की हथकरघा शिकारगाह शुद्ध कतान सिल्क साड़ी, पूजा व त्यौहारों के लिए अलौकिक कृति।',
        price: 24000,
        offer_price: 19500,
        colour: 'Auspicious Sindoor Red',
        size: '6.3 Meters',
        fabric: '100% Handloom Katan Silk',
        material: 'Mythological Jaal in Pure Gold Zari',
        is_featured: 1,
        images: JSON.stringify([
          '/src/assets/images/designer_banarasi_saree_1790317467169.jpg'
        ]),
        variants: [
          { sku: 'SV-FST-001-RED', colour: 'Sindoor Red', size: '6.3 M', price: 19500, qty: 5 }
        ]
      },
      {
        catId: 3,
        subId: 10,
        name: 'Kesariya Tussar Silk Mens Kurta & Dhoti Set',
        name_hi: 'केसरिया टसर सिल्क कुर्ता व धोती सेट',
        sku: 'SV-FST-003',
        desc: 'Traditional auspicious saffron silk kurta paired with a readymade bordered dhoti for Diwali, Havans, and sacred family rituals.',
        desc_hi: 'दीपावली, हवन व पूजा अनुष्ठानों के लिए प्रामाणिक केसरिया टसर सिल्क कुर्ता और जरी बॉर्डर धोती।',
        price: 9500,
        offer_price: 7499,
        colour: 'Kesariya Saffron',
        size: '38, 40, 42',
        fabric: 'Pure Tussar Silk',
        material: 'Kantha Stitch Accents & Gold Border Dhoti',
        is_featured: 0,
        images: JSON.stringify([
          '/src/assets/images/groom_royal_sherwani_1790317453744.jpg'
        ]),
        variants: [
          { sku: 'SV-FST-003-SAF', colour: 'Kesariya Saffron', size: '40', price: 7499, qty: 5 }
        ]
      }
    ];

    for (const prod of productsData) {
      db.run(`
        INSERT INTO products (category_id, subcategory_id, name, name_hi, sku, description, description_hi, price, offer_price, colour, size, fabric, material, is_featured, is_active, stock_status, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'In Stock', ?);
      `, [
        prod.catId,
        prod.subId,
        prod.name,
        prod.name_hi,
        prod.sku,
        prod.desc,
        prod.desc_hi,
        prod.price,
        prod.offer_price,
        prod.colour,
        prod.size,
        prod.fabric,
        prod.material,
        prod.is_featured,
        prod.images
      ]);

      const lastProdId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

      for (const variant of prod.variants) {
        db.run(`
          INSERT INTO product_variants (product_id, sku, colour, size, price, offer_price, quantity, images)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `, [lastProdId, variant.sku, variant.colour, variant.size, variant.price, variant.price, variant.qty, prod.images]);

        const lastVarId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

        db.run(`
          INSERT INTO inventory (product_id, variant_id, sku, colour, size, quantity, min_threshold)
          VALUES (?, ?, ?, ?, ?, ?, 3);
        `, [lastProdId, lastVarId, variant.sku, variant.colour, variant.size, variant.qty]);
      }
    }

    // Seed Initial Customers
    db.run(`
      INSERT INTO customers (name, phone, email, city, notes, total_enquiries, total_orders, total_spent) VALUES
      ('Ramkesh Sahu', '09425810011', 'ramkesh.sahu@gmail.com', 'Jabalpur', 'Prefers pure cotton sarees for mother-in-law. Highly appreciative of authentic quality.', 1, 1, 3700),
      ('Aryan Patel', '09826190022', 'aryan.patel@outlook.com', 'Jabalpur', 'Family wedding shopping. Looked for groom sherwani & sister''s lehenga.', 2, 1, 32500),
      ('Sarika Kanojiya', '09752340033', 'sarika.k@gmail.com', 'Jabalpur', 'Regular customer for festive suits and kurtis.', 1, 1, 5999),
      ('Dr. Meenakshi Dubey', '09179055444', 'dubey.meenakshi@gmail.com', 'Jabalpur', 'Bridal enquiry for upcoming winter wedding in December.', 1, 0, 0);
    `);

    // Seed Enquiries
    db.run(`
      INSERT INTO enquiries (enquiry_code, customer_id, customer_name, phone, email, product_id, product_name, category_id, variant_info, colour, size, quantity, budget, preferred_contact, message, status, assigned_staff_id, follow_up_date, internal_notes)
      VALUES
      ('SV-ENQ-2026-1001', 4, 'Dr. Meenakshi Dubey', '09179055444', 'dubey.meenakshi@gmail.com', 1, 'Rajwada Crimson Zardozi Bridal Lehenga', 1, 'Royal Crimson Red (Semi-Stitched)', 'Royal Crimson Red', 'Semi-Stitched', 1, '₹40,000 - ₹55,000', 'WhatsApp', 'Looking for December wedding. Need video call showcase or trial appointment.', 'Follow-up', 2, '2026-09-26', 'Customer requested video call over WhatsApp on Saturday morning.'),
      ('SV-ENQ-2026-1002', 2, 'Aryan Patel', '09826190022', 'aryan.patel@outlook.com', 4, 'Maharaja Ivory & Muted Gold Raw Silk Sherwani', 3, 'Ivory Gold (Size 40)', 'Ivory Gold', '40', 1, '₹25,000 - ₹35,000', 'Showroom Visit', 'Need matching safa and footwear trial.', 'Interested', 1, '2026-09-25', 'Visit planned this Friday afternoon. Keep size 40 and 42 ready in trial room.'),
      ('SV-ENQ-2026-1003', 1, 'Ramkesh Sahu', '09425810011', 'ramkesh.sahu@gmail.com', 5, 'Narmada Classic Pure Cotton Temple Border Saree', 4, 'Indigo Blue (5.5 M)', 'Indigo Blue', '5.5 M', 2, '₹3,000 - ₹5,000', 'Call', 'Enquired for 2 pieces of cotton saree for gifting.', 'Converted', 2, '2026-09-20', 'Purchased in-store on 20th. Satisfied review posted on Google.');
    `);

    // Seed Follow-ups
    db.run(`
      INSERT INTO follow_ups (enquiry_id, customer_name, customer_phone, product_name, staff_name, follow_up_date, notes, status) VALUES
      (1, 'Dr. Meenakshi Dubey', '09179055444', 'Rajwada Crimson Zardozi Bridal Lehenga', 'Priya Sharma', '2026-09-26', 'Coordinate WhatsApp video call showing dupatta borders and blouse piece.', 'Pending'),
      (2, 'Aryan Patel', '09826190022', 'Maharaja Ivory & Muted Gold Raw Silk Sherwani', 'Rahul Verma', '2026-09-25', 'Welcome to showroom, coordinate matching safa styling.', 'Pending');
    `);

    // Seed Sample Order & Invoice
    const orderItems = JSON.stringify([
      { sku: 'SV-CT-301-BLU', name: 'Narmada Classic Pure Cotton Temple Border Saree', colour: 'Indigo Blue', quantity: 2, price: 1850, total: 3700 }
    ]);

    db.run(`
      INSERT INTO orders (order_code, customer_id, customer_name, customer_phone, customer_address, items_json, subtotal, discount, tax, total_amount, payment_status, order_status, assigned_staff_id, notes)
      VALUES ('SV-ORD-2026-501', 1, 'Ramkesh Sahu', '09425810011', 'Gorakhpur, Jabalpur', ?, 3700, 0, 0, 3700, 'Paid', 'Completed', 2, 'Delivered in store. Pure cotton satisfied.');
    `, [orderItems]);

    db.run(`
      INSERT INTO invoices (invoice_code, order_id, enquiry_id, customer_name, customer_phone, customer_email, customer_address, items_json, subtotal, discount, tax, total_amount, amount_paid, balance_due, payment_status, payment_method, notes)
      VALUES ('SV-INV-2026-901', 1, 3, 'Ramkesh Sahu', '09425810011', 'ramkesh.sahu@gmail.com', 'Gorakhpur, Jabalpur', ?, 3700, 0, 0, 3700, 3700, 0, 'Paid', 'UPI', 'Store billing - Shree Vijay Showroom Jabalpur');
    `, [orderItems]);

    // Activity Log
    db.run(`
      INSERT INTO activity_logs (staff_name, role, action, target, details) VALUES
      ('System', 'SUPER ADMIN', 'Database Initialized', 'Store Setup', 'Initial seed data and clothing catalog configured successfully.'),
      ('Rahul Verma', 'MANAGER', 'Product Stock Verified', 'All Categories', 'Showroom physical count matched with system.'),
      ('Priya Sharma', 'SALES STAFF', 'Enquiry Converted', 'SV-ENQ-2026-1003', 'Ramkesh Sahu completed purchase of pure cotton sarees.');
    `);
  }
}
