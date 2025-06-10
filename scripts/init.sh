#!/bin/sh

echo "Aguardando o banco de dados..."
# Aguarda até que o banco de dados esteja pronto para aceitar conexões
while ! nc -z db 5432; do
  sleep 1
done

echo "Banco de dados pronto!"

# Executa as migrações do Prisma
echo "Executando migrações..."
pnpm exec prisma migrate deploy

# Executa o seed se necessário (apenas se não houver dados)
echo "Verificando necessidade de seed..."
if ! psql -h db -U postgres -d marquei -c "SELECT * FROM negocios LIMIT 1" > /dev/null 2>&1; then
  echo "Executando seed..."
  pnpm exec prisma db seed
fi

# Inicia a aplicação
echo "Iniciando a aplicação..."
pnpm run dev 