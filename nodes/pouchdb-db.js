/**
 * Shared Database Configuration Node
 */

'use strict'

//#region --- Type Defs --- //
/**
 * @typedef {import('node-red')} Red
 */
//#endregion --- Type Defs --- //

//#region ------ Require packages ------ //
/** PouchDB pre-configured for Node.js with the LevelDB adapter, replication, HTTP, map/reduce plugins */
const PouchDB = require('pouchdb-node') // https://pouchdb.com/custom.html#pouchdb-node
//#endregion ----- Require packages ----- //

//#region ------ module-level globals ------ //
/** Node name must match this nodes html file @constant {string} uib.moduleName */
const nodeName = 'pouchdb-db'
//#endregion ----- module-level globals ----- //

/** Export the function that defines the node 
 * @type Red */
 module.exports = function(/** @type Red */ RED) {

    /** Run the node instance - called from registerType()
     * @param {Object} config The configuration object passed from the Admin interface (see the matching HTML file)
     */
     function nodeInstance(config) {
        // @ts-ignore - Create the node instance
        RED.nodes.createNode(this, config)

        // copy 'this' object in case we need it in context of callbacks of other functions.
        const node = this

        /** Create local copies of the node configuration (as defined in the .html file)
         *  NB: Best to use defaults here as well as in the html file for safety
         **/
        node.dbname   = config.dbname || 'pouchdb-default'

        /** Create the PouchDB database
         * @see https://pouchdb.com/api.html#create_database
         */
        node.db = new PouchDB(node.dbname);

     } // ---- End of nodeGo (initialised node instance) ---- //

    /** Register the node by name. This must be called before overriding any of the
     *  Node functions. */
    // @ts-ignore
    RED.nodes.registerType(nodeName, nodeInstance, {})

 } // ==== End of module.exports ==== // 

 // EOF