#!/bin/sh

# Aguardar o PostgreSQL estar pronto
echo "Aguardando PostgreSQL..."
while ! pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  sleep 1
done

# Executar migração
echo "Executando migração..."
cd /app && npx tsx src/scripts/migrate-to-postgres.ts

# Verificar se a migração foi bem-sucedida
if [ $? -eq 0 ]; then
  echo "Migração concluída com sucesso!"
  exit 0
else
  echo "Erro durante a migração!"
  exit 1
fi 