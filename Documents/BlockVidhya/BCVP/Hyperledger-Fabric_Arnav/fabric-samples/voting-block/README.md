## Voting Block (BCVP)

The directions for using this are documented in the Hyperledger Fabric
["Build Your First Network"](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html) tutorial.

*NOTE:* After navigating to the documentation, choose the documentation version that matches your version of Fabric

Steps:

docker rm -f $(docker ps -aq) && docker volume prune && docker rmi -f $(docker images | grep dev | awk '{print $3}')
sudo rm -rf organizations/fabric-client-kv-org1
sudo rm -rf organizations/fabric-client-kv-org2
sudo ./voting-block.sh up -s couchdb -o kafka
cd organizations
sudo $(which node) app.js
curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=Jim&orgName=Org1' | json_pp > Org1.json
curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=Tim&orgName=Org2' | json_pp > Org2.json

curl -s -X GET "http://localhost:4000/channels/voting-channel/chaincodes/mycc?peer=peer0.org1.example.com&fcn=query&args=%5B%22%22%5D" -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTgzNzk3NjksInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTgzNDM3Njl9.OIV9UWOoCe_cY8m6qtkewSbQ7QOEt760VGmMrM6ExJk" -H "content-type: application/json"

curl --noproxy -s -X POST http://localhost:4000/channels/voting-channel/chaincodes/mycc -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTgzNzk3NzQsInVzZXJuYW1lIjoiVGltIiwib3JnTmFtZSI6Ik9yZzIiLCJpYXQiOjE1NTgzNDM3NzR9.7WuyMqnILYgygAyLtJ6Q7FumLZpqq_pZ-jwK9hA92Uo" -H "content-type: application/json" -d '{"peers": ["peer0.org1.example.com", "peer2.org1.example.com","peer3.org1.example.com"],"fcn":"vote","args":["Congress"]}'