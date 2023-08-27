docker build -t musicnbrain/repertoire-frontend .
docker run -d -p 8080:8080 --name repertoire-frontend musicnbrain/repertoire-frontend
