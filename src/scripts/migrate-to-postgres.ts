import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../integrations/supabase/client';
import { createTables, migrateDataFromSupabase, testConnection } from '../integrations/postgres/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchSupabaseData() {
  try {
    console.log('Conectando ao Supabase...');
    console.log('Diretório atual:', __dirname);
    
    // Buscar todos os dados do Supabase
    const [
      adminUsersResult,
      categoriesResult,
      galleryImagesResult,
      giftsResult,
      siteSettingsResult
    ] = await Promise.all([
      supabase.from('admin_users').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('gallery_images').select('*'),
      supabase.from('gifts').select('*'),
      supabase.from('site_settings').select('*')
    ]);

    // Verificar erros
    if (adminUsersResult.error) throw new Error(`Erro ao buscar admin_users: ${adminUsersResult.error.message}`);
    if (categoriesResult.error) throw new Error(`Erro ao buscar categories: ${categoriesResult.error.message}`);
    if (galleryImagesResult.error) throw new Error(`Erro ao buscar gallery_images: ${galleryImagesResult.error.message}`);
    if (giftsResult.error) throw new Error(`Erro ao buscar gifts: ${giftsResult.error.message}`);
    if (siteSettingsResult.error) throw new Error(`Erro ao buscar site_settings: ${siteSettingsResult.error.message}`);

    // Log dos dados encontrados
    console.log(`Dados encontrados no Supabase:
      - Admin Users: ${adminUsersResult.data?.length || 0}
      - Categories: ${categoriesResult.data?.length || 0}
      - Gallery Images: ${galleryImagesResult.data?.length || 0}
      - Gifts: ${giftsResult.data?.length || 0}
      - Site Settings: ${siteSettingsResult.data?.length || 0}
    `);

    return {
      admin_users: adminUsersResult.data || [],
      categories: categoriesResult.data || [],
      gallery_images: galleryImagesResult.data || [],
      gifts: giftsResult.data || [],
      site_settings: siteSettingsResult.data || []
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Supabase:', error);
    throw error;
  }
}

async function migrate() {
  try {
    console.log('Iniciando processo de migração...');
    console.log('Configurações do PostgreSQL:');
    console.log(`- Host: ${process.env.POSTGRES_HOST}`);
    console.log(`- Database: ${process.env.POSTGRES_DB}`);
    console.log(`- Port: ${process.env.POSTGRES_PORT}`);
    console.log(`- User: ${process.env.POSTGRES_USER}`);

    // Testar conexão com PostgreSQL
    console.log('\nTestando conexão com PostgreSQL...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Não foi possível conectar ao PostgreSQL. Verifique as configurações e tente novamente.');
    }

    // Criar tabelas no PostgreSQL
    console.log('\nCriando tabelas no PostgreSQL...');
    await createTables();

    // Buscar dados do Supabase
    console.log('\nBuscando dados do Supabase...');
    const supabaseData = await fetchSupabaseData();

    // Migrar dados para o PostgreSQL
    console.log('\nMigrando dados para o PostgreSQL...');
    await migrateDataFromSupabase(supabaseData);

    console.log('\nMigração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\nErro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrate(); 