mkdir certs
mkdir ./certs/conf
mkdir logs
touch logs/backend.txt
docker-compose -f docker-compose.initial.yml build
docker-compose -f docker-compose.initial.yml up -d assignment-nginx
echo "🔍 Hit ctrl+d after you are done with certbot!"
docker-compose exec assignment-nginx certbot certonly --nginx -d parking.antriko.co.uk
docker-compose down
echo "🚀 Done!"