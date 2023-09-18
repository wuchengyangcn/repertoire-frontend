sudo docker build -q -t musicnbrain/repertoire-frontend .
sudo docker run -d -p 80:8080 --name repertoire-frontend musicnbrain/repertoire-frontend
