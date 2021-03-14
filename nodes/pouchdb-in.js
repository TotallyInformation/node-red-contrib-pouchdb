'use strict'

//#region --- Type Defs --- //
/**
 * @typedef {import('node-red')} Red
 */
//#endregion --- Type Defs --- //

//#region ------ Require packages ------ //
/** PouchDB pre-configured for Node.js with the LevelDB adapter, replication, HTTP, map/reduce plugins */
var PouchDB = require('pouchdb-node') // https://pouchdb.com/custom.html#pouchdb-node
//#endregion ----- Require packages ----- //

//#region ------ module-level globals ------ //
/** Node name must match this nodes html file @constant {string} uib.moduleName */
const nodeName = 'pouchdb-in'
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
        node.name   = config.name || ''
        node.topic  = config.topic || '' // NB: will be overwritten by msg.topic if received
        node.dbconfig = config.dbconfig
 
        // Get the shared DB object from the configuration node
        let configObj = RED.nodes.getNode(config.dbconfig)
        node.dbname = configObj.dbname
        node.db = configObj.db

        console.log('[pouchdb-in] ', node.dbconfig, node.dbname, node.db.name, node.db.adapter )
        
        // Create a change listener
        node.db.changes({
            live: true,
            since: 'now',
            include_docs: true,
          }).on('change', function(change) {
            // handle change
            console.log('[pouchdb-in] CHANGE ', change)
            node.send({
                topic: node.topic,
                payload: change
            })
          }).on('complete', function(info) {
            // changes() was canceled
            console.log('[pouchdb-in] CHANGE-CANCELLED ', info)
          }).on('error', function (err) {
            console.log('[pouchdb-in] ERROR ', err)
          })
 
     } // ---- End of nodeGo (initialised node instance) ---- //

    /** Register the node by name. This must be called before overriding any of the
     *  Node functions. */
    // @ts-ignore
    RED.nodes.registerType(nodeName, nodeInstance, {
        // credentials: {
        //     jwtSecret: {type:'password'},
        // },
        // settings: {
        //     uibuilderNodeEnv: { value: process.env.NODE_ENV, exportable: true },
        //     uibuilderTemplates: { value: templateConf, exportable: true },
        // },
    })

 } // ==== End of module.exports ==== // 

 // EOF