package main

import (
	"bytes"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("voting-block Init")
	_, args := stub.GetFunctionAndParameters()
	var PartyCodes []string
	var err error

	for i := 0; i < len(args); i++ {
		PartyCodes = append(PartyCodes, args[i])
	}

	// Write the state to the ledger
	for i := 0; i < len(PartyCodes); i++ {
		err = stub.PutState(PartyCodes[i], []byte("0"))
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("voting-block Invoke")
	function, args := stub.GetFunctionAndParameters()
	if function == "vote" {
		return t.vote(stub, args)

	} else if function == "query" {
		return t.queryAll(stub, args)
	}

	return shim.Error("Invalid invoke function name. Expecting \"vote\" \"query\"")
}

// Transaction makes payment of X units from A to B
func (t *SimpleChaincode) vote(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	mspid, err := cid.GetMSPID(stub)
	if err != nil {
		return shim.Error(err.Error())
	}
	if mspid != "Org1MSP" {
		return shim.Error("Not authorized to vote.")
	}

	var A string
	var Aval int

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	A = args[0]

	// Get the state from the ledger
	// TODO: will be nice to have a GetAllState call to ledger
	Avalbytes, err := stub.GetState(A)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if Avalbytes == nil {
		Aval = 0
	} else {
		Aval, _ = strconv.Atoi(string(Avalbytes))
	}
	// Perform the execution
	Aval = Aval + 1

	// Write the state back to the ledger
	err = stub.PutState(A, []byte(strconv.Itoa(Aval)))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// query callback representing the query of a chaincode
func (t *SimpleChaincode) queryAll(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	mspid, err := cid.GetMSPID(stub)
	if err != nil {
		return shim.Error(err.Error())
	}
	if mspid != "Org2MSP" {
		return shim.Error("Not authorized to query.")
	}

	startKey := ""
	endKey := ""

	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Party\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Votes\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAll:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
