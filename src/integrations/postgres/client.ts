import { Pool } from 'pg';

// Configuração do PostgreSQL
export const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'wishflow_gift_catalog',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com PostgreSQL estabelecida com sucesso!');
    client.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com PostgreSQL:', error);
    return false;
  }
};

// Função para criar as tabelas
export const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Criar tabela admin_users
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false
      );
    `);

    // Criar tabela categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    // Criar tabela gallery_images
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255),
        url TEXT NOT NULL
      );
    `);

    // Criar tabela gifts
    await client.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT NOT NULL,
        category_id UUID REFERENCES categories(id),
        status VARCHAR(50) NOT NULL DEFAULT 'available',
        cash_payment_link TEXT,
        installment_payment_link TEXT
      );
    `);

    // Criar tabela site_settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        primary_color VARCHAR(50) NOT NULL,
        background_color VARCHAR(50) NOT NULL
      );
    `);

    await client.query('COMMIT');
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar tabelas:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Função para migrar dados do Supabase
export const migrateDataFromSupabase = async (supabaseData: {
  admin_users: any[];
  categories: any[];
  gallery_images: any[];
  gifts: any[];
  site_settings: any[];
}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Migrar admin_users
    for (const user of supabaseData.admin_users) {
      await client.query(`
        INSERT INTO admin_users (id, created_at, username, password, is_admin)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE
        SET username = EXCLUDED.username,
            password = EXCLUDED.password,
            is_admin = EXCLUDED.is_admin
      `, [user.id, user.created_at, user.username, user.password, user.is_admin]);
    }

    // Migrar categories
    for (const category of supabaseData.categories) {
      await client.query(`
        INSERT INTO categories (id, created_at, name, slug)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            slug = EXCLUDED.slug
      `, [category.id, category.created_at, category.name, category.slug]);
    }

    // Migrar gallery_images
    for (const image of supabaseData.gallery_images) {
      await client.query(`
        INSERT INTO gallery_images (id, created_at, title, url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            url = EXCLUDED.url
      `, [image.id, image.created_at, image.title, image.url]);
    }

    // Migrar gifts
    for (const gift of supabaseData.gifts) {
      await client.query(`
        INSERT INTO gifts (id, created_at, title, description, price, image_url, category_id, status, cash_payment_link, installment_payment_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            image_url = EXCLUDED.image_url,
            category_id = EXCLUDED.category_id,
            status = EXCLUDED.status,
            cash_payment_link = EXCLUDED.cash_payment_link,
            installment_payment_link = EXCLUDED.installment_payment_link
      `, [
        gift.id,
        gift.created_at,
        gift.title,
        gift.description,
        gift.price,
        gift.image_url,
        gift.category_id,
        gift.status,
        gift.cash_payment_link,
        gift.installment_payment_link
      ]);
    }

    // Migrar site_settings
    for (const settings of supabaseData.site_settings) {
      await client.query(`
        INSERT INTO site_settings (id, created_at, title, description, primary_color, background_color)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            primary_color = EXCLUDED.primary_color,
            background_color = EXCLUDED.background_color
      `, [
        settings.id,
        settings.created_at,
        settings.title,
        settings.description,
        settings.primary_color,
        settings.background_color
      ]);
    }

    await client.query('COMMIT');
    console.log('Dados migrados com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao migrar dados:', error);
    throw error;
  } finally {
    client.release();
  }
}; 