sudo docker build -t musicnbrain/repertoire-frontend .
sudo docker run -d -p 8080:8080 --name repertoire-frontend musicnbrain/repertoire-frontend
