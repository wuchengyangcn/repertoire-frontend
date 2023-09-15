sudo docker build -q -t musicnbrain/repertoire-frontend .
sudo docker run -q -d -p 8080:8080 --name repertoire-frontend musicnbrain/repertoire-frontend
