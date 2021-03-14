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
const nodeName = 'pouchdb-out'
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

        console.log('[pouchdb-out] ', node.dbconfig, node.dbname, node.db.name, node.db.adapter )

        /** Handler function for node flow input events (when a node instance receives a msg from the flow)
         * @see https://nodered.org/blog/2019/09/20/node-done 
         * @param {Object} msg The msg object received.
         * @param {function} send Per msg send function, node-red v1+
         * @param {function} done Per msg finish function, node-red v1+
         **/
        function nodeInputHandler(msg, send, done) {

            let cmd = msg.cmd || 'put'  // put, 

            switch (cmd) {
                case 'put':
                    node.db.put({
                        // Doc ID - must be a string
                        _id: msg.id || msg._id || msg.docId || msg.docid || 'mydoc',
                        topic: msg.topic || node.topic || undefined,
                        payload: msg.payload
                      }).then(function (response) {
                        // handle response
                        console.log('[pouchdb-out] RESPONSE ', response)
                      }).catch(function (err) {
                        //console.error('[pouchdb-out] ERROR writing document ', err)
                        node.error(`[pouchdb-out] ERROR writing document: ${err.message}`, err)
                      })
                            
                    break;
            
                default:
                    node.error('[pouchdb-out] ERROR: msg.cmd not recognised. Must be one of [put, update, delete]')
                    break;
            }

        } // -- end of flow msg received processing -- //

        // Process inbound messages
        node.on('input', nodeInputHandler)

 
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