sync=0

cd ~/repertoire-frontend
git fetch
if git status | grep -q 'is behind'; then
  sync=1
fi

if [ $sync == 1 ]; then
  echo "clean docker"
  sudo docker kill $(sudo docker ps --filter "name=repertoire-frontend" -aq)
  sudo docker rm $(sudo docker ps --filter "name=repertoire-frontend" -aq)
  sudo docker rmi $(sudo docker images musicnbrain/repertoire-frontend -q)
  sudo docker rmi $(sudo docker images node -q)

  echo "build docker"
  cd ~/repertoire-frontend
  ./build.sh
fi

echo "frontend sync complete"