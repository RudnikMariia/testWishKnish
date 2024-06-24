import KnishIOModel from 'src/models/KnishIOModel'
import { randomString } from 'src/libraries/strings'

/**
 * Class for managing metadata operations.
 * Extends KnishIOModel to leverage metadata handling functionalities.
 */
export default class SecureMessage extends KnishIOModel {
  /**
   * Create new metadata on the ledger.
   *
   * @param {KnishIOClient} client The KnishIOClient instance.
   * @param {string} message The message content.
   * @param {string} author The author of the message.
   * @returns {Promise<boolean>} true if creation is successful; false if there is an error.
   */
  async create (client, { message, author }) {
    try {
      const response = await client.createMeta({
        metaType: KnishIOModel.resolveMetaType(this.constructor.metaType),
        metaId: randomString(64),
        meta: {
          message,
          author
        }
      })

      if (response.success()) {
        return true
      } else {
        console.error('Error creating meta:')
        return false
      }
    } catch (error) {
      console.error('Error creating meta:', error)
      return false
    }
  }

  /**
   * Query metadata from the ledger.
   *
   * @param {KnishIOClient} client The KnishIOClient instance.
   * @param {Object} options Options for querying metadata.
   * @param {number} options.limit Number of results to limit.
   * @param {number} options.offset Offset for paginating results.
   * @param {Object} options.filter Filter criteria for querying metadata.
   * @returns {Promise<boolean>} true if query is successful; false if there is an error.
   */
  async queryMeta (client, { limit = 20, offset = 1, filter = {} }) {
    try {
      const response = await client.queryAtom({
        metaTypes: KnishIOModel.resolveMetaType(this.constructor.metaType),
        isotope: 'M',
        queryArgs: { limit, offset },
        filter
      })

      const payload = response.payload()
      if (payload && payload.instances) {
        this.setPagination(payload.paginatorInfo, limit)
        this.setMessages(payload.instances)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error querying meta:', error)
      return false // Handle error case by returning false
    }
  }

  /**
   * Set pagination information based on response data.
   *
   * @param {Object} paginatorInfo Paginator information from API response.
   * @param {number} limit Number of results per page.
   */
  setPagination (paginatorInfo, limit) {
    const totalPages = Math.ceil(paginatorInfo.total / limit || 10)
    this.pagination = {
      ...paginatorInfo,
      totalPages
    }
  }

  /**
   * Set messages based on response instances.
   *
   * @param {Array<Object>} instances List of message instances from API response.
   */
  setMessages (instances) {
    this.messages = instances.map(instance => ({
      author: instance.metas.author,
      message: instance.metas.message,
      createdAt: instance.createdAt,
      id: instance.metaId
    }))
  }
}

SecureMessage.metaType = 'SecureMessage'
