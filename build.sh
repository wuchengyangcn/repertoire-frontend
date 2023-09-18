sudo docker build -q -t musicnbrain/repertoire-frontend .
sudo docker run -d -p 80:80 --name repertoire-frontend musicnbrain/repertoire-frontend
