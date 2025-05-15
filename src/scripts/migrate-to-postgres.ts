import { supabase } from '@/integrations/supabase/client';
import { createTables, migrateDataFromSupabase } from '@/integrations/postgres/client';

async function fetchSupabaseData() {
  try {
    // Buscar todos os dados do Supabase
    const [
      { data: admin_users },
      { data: categories },
      { data: gallery_images },
      { data: gifts },
      { data: site_settings }
    ] = await Promise.all([
      supabase.from('admin_users').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('gallery_images').select('*'),
      supabase.from('gifts').select('*'),
      supabase.from('site_settings').select('*')
    ]);

    return {
      admin_users: admin_users || [],
      categories: categories || [],
      gallery_images: gallery_images || [],
      gifts: gifts || [],
      site_settings: site_settings || []
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Supabase:', error);
    throw error;
  }
}

async function migrate() {
  try {
    console.log('Iniciando migração...');

    // Criar tabelas no PostgreSQL
    console.log('Criando tabelas no PostgreSQL...');
    await createTables();

    // Buscar dados do Supabase
    console.log('Buscando dados do Supabase...');
    const supabaseData = await fetchSupabaseData();

    // Migrar dados para o PostgreSQL
    console.log('Migrando dados para o PostgreSQL...');
    await migrateDataFromSupabase(supabaseData);

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrate(); 