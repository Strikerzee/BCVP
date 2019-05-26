1. Voting and Querying
2. Access control

3. Org1 can't see votes, 
	*can vote only during voting phase
4. Org2 can't vote, 
	*can see results only after voting phase

5. #Need to merge Node.js backends for registration of user of Orgs, voting (invoke), see result (query), automate token consumption
a. On POST /vote endpoint, invoke chaincode
b. On GET /results endpoint, query result
c. HLF Tokens need to be consumed once obtained.
d. WHEN TO GET TOKEN?

6. #Create separate credentials for Election Commission

7. **Runs using temporary docker container (robust storage like cloud/ file store)
8. **Not configured to run on other Ubuntu systems except mine (research and fix this)
9. **Need to manually remove docker container each time to reset election (automate this)
10. **Need to manually add cryptomaterial to crypto-config and network-config.yaml everytime (automate this)


# - Must implement
* - Can be added if time permits
** - Problems to be fixed in long run
