# node-red-contrib-pouchdb
EXPERIMENTAL - FOR TESTING ONLY

A Node-RED module for interfacing with PouchDB.

## Installation

Install via the Node-RED Editor's palette manager

Install development versions from GitHub:

```
cd ~/.node-red
npm install totallyinformation/node-red-contrib-pouchdb
```

## Usage

**Currently only the "put" output is implemented.**

A simple example is available in the Node-RED Editor import library.

### pouchdb-out

Send a msg to the node with the following schema:

```json
{
    // Optional, will be added to the document as the `topic` property
    // If not provided, the topic set in the node will be used if present
    "topic": "something - optional",
    // put, update, delete. Optional, if not provided, defaults to `put`
    "cmd": "put",
    // For put, this must be unique or an error will occue. 
    // For update/delete, it must be an existing document.
    "id": "unique-doc-id",
    // Payload will be output to the document as the `payload` property
    // This MUST be serialisable to JSON or the put/update will fail.
    "payload": ...
}
```

### pouchdb-in

Listens for changes to the defined database.

If a change is notified, returns a msg with the schema:

```json
{
    // The document identifier string
    "id": "idstring",
    // Array of detected changes showing the revision identifier
    "changes": [
        "rev": <revision identifier string>
        ...
    ],
    // The amended document object. Includes `doc._id` and `doc._rev` which are duplicates of the above properties
    "doc": ... ,
    // Update sequence identifier
    "seq": <integer>
}
```

See the [PouchDB documentation](https://pouchdb.com/api.html#changes) for more details.